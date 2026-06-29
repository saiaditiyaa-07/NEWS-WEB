require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Blog = require('../models/Blog');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blog_system';
    console.log('Connecting to database:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB. Starting database seeding...');

    // 1. Seed Admin
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
      await Admin.create({
        name: 'John Doe',
        email: 'admin@example.com',
        password: 'admin123456' // Hashing is handled by Admin Schema pre-save hook
      });
      console.log('Seeded default admin user:');
      console.log('  Email: admin@example.com');
      console.log('  Password: admin123456');
    } else {
      console.log('Admin user "admin@example.com" already exists.');
    }

    // 2. Seed Blogs if collection is empty
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      const demoBlogs = [
        {
          title: 'Unlocking Next.js 15+ Rendering Powerhouse',
          slug: 'unlocking-nextjs-15-rendering-powerhouse',
          description: 'Explore the performance upgrades, Server Components optimization, and best practices in Next.js 15 routing models.',
          content: `
            <h2>Introduction to Next.js 15</h2>
            <p>Next.js 15 introduces major shifts in how React Server Components (RSC) manage server caching, hydration, and routing behaviors. In this guide, we dive deep into configuring routes, optimizing layouts, and utilizing dynamic rendering features.</p>
            <h3>1. The Evolution of Server Components</h3>
            <p>React Server Components run entirely on the server. They reduce JavaScript payload sizes, resulting in outstanding Time to Interactive (TTI) speeds. In Next.js 15, layouts are cached dynamically with an emphasis on fresher content, balancing load speeds with immediate reactivity.</p>
            <h3>2. Optimizing API Handlers</h3>
            <p>API handlers in the App Router are robust. By utilizing native caching behaviors or custom Route Handlers, developers can retrieve backend data with low latency.</p>
            <blockquote>"Next.js 15 is a massive step forward for web application performance and modular layout structures."</blockquote>
            <p>Implement server actions for mutations to completely eliminate traditional boilerplates for forms and state synchronization.</p>
          `,
          category: 'Technology',
          author: 'John Doe',
          featuredImage: '/uploads/demo-nextjs.png',
          status: 'published',
          tags: ['Nextjs', 'React', 'WebDev'],
          views: 142
        },
        {
          title: 'The Blueprint for Minimalist Dashboard Design',
          slug: 'blueprint-minimalist-dashboard-design',
          description: 'A comprehensive checklist on grid alignment, spacing intervals, typography systems, and modern visual aesthetics.',
          content: `
            <h2>Crafting Premium Dashboard Interfaces</h2>
            <p>A great dashboard gives immediately actionable insights without visual overload. Utilizing Apple-style Bento Grids, clean outlines, and intentional shadows achieves high visual hierarchy.</p>
            <h3>1. Grid Spacing & Alignment</h3>
            <p>Use a strict 4px or 8px grid alignment. Keep padding consistent (e.g. 1.5rem or 24px) inside cards. Always use responsive grid configurations so layouts flow seamlessly from mobile screen sizes up to ultrawide desktops.</p>
            <h3>2. Color Accents & Status Badges</h3>
            <p>Avoid raw colors. Use tailwind palettes like Emerald (#10B981) for positives, Rose (#F43F5E) for negatives, and Amber (#F59E0B) for warnings. Ensure a light or dark neutral base supports these high contrast badges.</p>
            <p>Combine with dynamic transitions (150ms hover elevations) to make elements feel responsive and premium.</p>
          `,
          category: 'Design',
          author: 'John Doe',
          featuredImage: '/uploads/demo-design.png',
          status: 'published',
          tags: ['UIUX', 'DesignSystem', 'CSS'],
          views: 98
        },
        {
          title: 'Effective Product Growth Strategies for Solo Devs',
          slug: 'effective-product-growth-strategies-solo-devs',
          description: 'How to build, market, and validate SaaS products with micro-budgets and efficient developer workflows.',
          content: `
            <h2>Solo Founder Product Development</h2>
            <p>Building a product is only half the battle. Successful solo developers dedicate equal effort to micro-testing, building in public, and automated marketing loops.</p>
            <h3>1. Fast Prototyping</h3>
            <p>Use modern boilerplates, templates, and pre-packaged toolkits like the one being created here. Avoid premature scaling or writing overly complex database schemas in the pre-revenue phase.</p>
            <h3>2. Distribution & SEO</h3>
            <p>Write educational blog posts, build tiny helpful sub-tools, and share progress updates on developer forums. Generating clean SEO-friendly URLs increases discovery opportunities.</p>
          `,
          category: 'Business',
          author: 'John Doe',
          featuredImage: '/uploads/demo-business.png',
          status: 'draft',
          tags: ['SaaS', 'Founder', 'Growth'],
          views: 5
        }
      ];

      // Ensure mock images exist in the folder (as placeholders or actual files)
      const fs = require('fs');
      const path = require('path');
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Create dummy empty image files so the server doesn't error when serving them
      ['demo-nextjs.png', 'demo-design.png', 'demo-business.png'].forEach(filename => {
        const filePath = path.join(uploadsDir, filename);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, ''); // Empty file
        }
      });

      await Blog.insertMany(demoBlogs);
      console.log(`Seeded ${demoBlogs.length} initial blogs successfully.`);
    } else {
      console.log(`Blogs collection already has ${blogCount} records.`);
    }

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding database error:', error);
    process.exit(1);
  }
};

seedData();
