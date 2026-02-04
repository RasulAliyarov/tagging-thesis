'use client'

import Link from 'next/link'
import { Sparkles, Zap, Target, ShieldCheck, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process thousands of texts in seconds with our optimized AI engine.',
      color: 'blue',
    },
    {
      icon: Target,
      title: 'Accurate Results',
      description: 'Advanced NLP models ensure 95%+ accuracy in sentiment detection.',
      color: 'purple',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Ready',
      description: 'Built with security, scalability, and compliance in mind.',
      color: 'pink',
    },
  ]

  const steps = [
    { number: 1, title: 'Upload Text', description: 'Paste text or upload CSV files' },
    { number: 2, title: 'AI Analysis', description: 'Our AI processes your content' },
    { number: 3, title: 'Get Insights', description: 'View sentiment and priority' },
    { number: 4, title: 'Take Action', description: 'Export and act on results' },
  ]

  const stats = [
    { value: '1M+', label: 'Texts Analyzed' },
    { value: '95%', label: 'Accuracy Rate' },
    { value: '500+', label: 'Enterprise Clients' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 gradient-text">
            AI-Powered Text Analysis
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Transform your text data into actionable insights with advanced sentiment analysis,
            priority detection, and intelligent categorization.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            {/* <Link
              href="/authorization"
              className="px-8 py-4 glass rounded-xl font-semibold hover:bg-slate-700/50 transition-all"
            >
              Login
            </Link> */}
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass rounded-2xl p-8 hover-lift"
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass rounded-3xl p-12 mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {step.number}
                </div>
                <h4 className="font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <p className="text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}