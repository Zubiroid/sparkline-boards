import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="5" height="18" rx="1" />
        <rect x="10" y="3" width="5" height="12" rx="1" />
        <rect x="17" y="3" width="5" height="7" rx="1" />
      </svg>
    ),
    title: 'Visual Kanban Board',
    description: 'Drag and drop content across customizable workflow stages. Set WIP limits and track progress at a glance.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    title: 'Editorial Calendar',
    description: 'Plan your content schedule with weekly and monthly views. Never miss a deadline again.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Focused Editor',
    description: 'Distraction-free writing with autosave, metadata management, and focus mode.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18" />
        <path d="M18 9l-5-5-4 4-3-3" />
      </svg>
    ),
    title: 'Analytics & Insights',
    description: 'Track content throughput, completion times, and identify bottlenecks in your workflow.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
    title: 'Multi-Platform Support',
    description: 'Manage content for blog, social media, newsletters, and video all in one place.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Team Collaboration',
    description: 'Role-based access control and shared workflows for content teams of any size.'
  }
];

const testimonials = [
  {
    quote: "ContentOps transformed how our marketing team manages content. We went from chaos to clarity in just one week.",
    author: "Sarah Chen",
    role: "Marketing Director",
    company: "TechFlow Inc."
  },
  {
    quote: "The Kanban board is a game-changer. I can finally see where everything stands and what needs attention.",
    author: "Marcus Johnson",
    role: "Content Strategist",
    company: "Digital Wave"
  },
  {
    quote: "Simple, focused, and effective. It's exactly what we needed without all the enterprise bloat.",
    author: "Emily Rodriguez",
    role: "Founder",
    company: "Content First Agency"
  }
];

const stats = [
  { value: '10K+', label: 'Content Creators' },
  { value: '500K+', label: 'Items Published' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' }
];

export default function Landing() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background-subtle" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div 
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Now with real-time collaboration
            </motion.div>
            
            <motion.h1 
              variants={fadeUp}
              className="text-5xl lg:text-7xl font-bold text-text-primary mb-6 tracking-tight"
            >
              Content Operations
              <br />
              <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                Made Simple
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeUp}
              className="text-xl lg:text-2xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Plan, organize, and publish with confidence. The modern content management 
              platform for creators and teams who ship.
            </motion.p>
            
            <motion.div 
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link 
                to="/register" 
                className="btn btn-primary btn-lg w-full sm:w-auto text-base px-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                Start Free Trial
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link 
                to="/app" 
                className="btn btn-outline btn-lg w-full sm:w-auto text-base px-8"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Live Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-background-subtle border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Everything you need to ship content
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              A complete toolkit for content teams, from ideation to publication and beyond.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background-subtle">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              From idea to published in 4 steps
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              A streamlined workflow that adapts to how you work.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Capture', desc: 'Jot down ideas as they come. Tag and organize them for later.' },
              { step: '02', title: 'Draft', desc: 'Write and refine your content with our distraction-free editor.' },
              { step: '03', title: 'Schedule', desc: 'Set publish dates and deadlines. Plan your content calendar.' },
              { step: '04', title: 'Publish', desc: 'Ship with confidence. Track performance and iterate.' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Loved by content creators
            </h2>
            <p className="text-lg text-text-secondary">
              Join thousands of teams shipping better content, faster.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-warning">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-primary mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">{testimonial.author}</div>
                    <div className="text-sm text-text-secondary">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary-hover">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Ready to streamline your content?
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              Start your free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="btn btn-lg bg-white text-primary hover:bg-neutral-100 px-10 font-semibold shadow-lg"
              >
                Get Started Free
              </Link>
              <Link 
                to="/contact" 
                className="btn btn-lg border-2 border-white/30 text-primary-foreground hover:bg-white/10 px-10"
              >
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
