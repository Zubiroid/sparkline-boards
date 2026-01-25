import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'For individuals and small projects',
      features: [
        '1 project',
        'Up to 100 content entries',
        '2 team members',
        'Basic content models',
        'Community support'
      ],
      cta: 'Get Started',
      ctaLink: '/auth/register',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'For growing teams and agencies',
      features: [
        'Unlimited projects',
        'Unlimited content entries',
        '10 team members',
        'Advanced content models',
        'Task management',
        'Role-based access',
        'Priority support',
        'API access'
      ],
      cta: 'Start Free Trial',
      ctaLink: '/auth/register',
      popular: true
    },
    {
      name: 'Team',
      price: '$99',
      period: 'per month',
      description: 'For larger organizations',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Custom content models',
        'Audit logs',
        'SSO authentication',
        'Dedicated support',
        'SLA guarantee',
        'Custom integrations'
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      popular: false
    }
  ];

  return (
    <PublicLayout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-text-secondary">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`card p-8 relative ${plan.popular ? 'border-primary border-2' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-text-primary mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-text-primary">{plan.price}</span>
                    <span className="text-text-muted">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-text-secondary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success shrink-0">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.ctaLink}
                  className={`btn btn-md w-full ${plan.popular ? 'btn-primary' : 'bg-surface hover:bg-surface-hover text-text-primary border border-border'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Can I switch plans later?',
                  a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
                },
                {
                  q: 'What happens when I reach my limits?',
                  a: 'We\'ll notify you when you\'re approaching limits. You can upgrade or remove unused entries.'
                },
                {
                  q: 'Is there a free trial for paid plans?',
                  a: 'Yes, Pro and Team plans include a 14-day free trial. No credit card required to start.'
                },
                {
                  q: 'Do you offer discounts for startups or non-profits?',
                  a: 'Yes, contact us for special pricing for eligible organizations.'
                }
              ].map((item, i) => (
                <div key={i} className="card p-6">
                  <h3 className="font-semibold text-text-primary mb-2">{item.q}</h3>
                  <p className="text-text-secondary text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
