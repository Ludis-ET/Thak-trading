'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, MapPin, Phone, ChevronRight, Zap, ArrowRight, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef, FormEvent } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'


import InfiniteScrollSlideshow from '@/components/InfiniteScrollSlideshow'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const slideInVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}

const slideRightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

const pulseVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: { duration: 2, repeat: Infinity },
  },
}

import LoadingScreen from '@/components/LoadingScreen'

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState<string>('')
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setStatusMessage('')

    const captchaToken = recaptchaRef.current?.getValue()
    const bypassRecaptcha = process.env.NEXT_PUBLIC_BYPASS_RECAPTCHA === 'true'

    if (!captchaToken && !bypassRecaptcha) {
      setStatus('error')
      setStatusMessage('Please complete the ReCAPTCHA verification.')
      return
    }

    try {
      const response = await fetch('/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, captchaToken }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setStatusMessage('Thank you! Your inquiry has been sent successfully.')
        setFormData({ name: '', email: '', company: '', message: '' })
        recaptchaRef.current?.reset()
      } else {
        setStatus('error')
        setStatusMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setStatusMessage('Failed to send message. Please try again later.')
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'hero') {
              setActiveSection('')
            } else {
              setActiveSection(entry.target.id)
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    const sections = document.querySelectorAll('section[id]')
    sections.forEach((section) => observer.observe(section))

    return () => sections.forEach((section) => observer.unobserve(section))
  }, [])

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Tsion Alemayehu', href: '#parent' },
    { name: 'Products', href: '#products' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LoadingScreen />
      {/* Navigation */}
      <motion.nav
        className="border-b border-border bg-card/50 backdrop-blur-sm fixed w-full top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.02 }}>
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="THAK Trading Logo"
                width={50}
                height={50}
                className="h-auto"
              />
              <div>
                <p className="text-lg font-bold tracking-tight"><span className="text-secondary">THAK</span> Trading</p>
                <p className="text-xs text-muted-foreground font-normal">Sister Company of Tsion Alemayehu</p>
              </div>
            </Link>
          </motion.div>
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition ${
                  activeSection === link.href.substring(1)
                    ? 'text-primary font-bold'
                    : 'hover:text-primary text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="#contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="pt-28 pb-12 px-6 bg-gradient-to-b from-card/50 to-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div className="space-y-6" variants={slideInVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>

              <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
                <motion.p variants={itemVariants} className="text-secondary text-sm font-semibold tracking-widest uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Premium Global Trading
                </motion.p>
                <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold tracking-tight text-balance">
                  Excellence in Spices & Legumes
                </motion.h1>
                <motion.p variants={itemVariants} className="text-lg text-muted-foreground text-balance">
                  Thak Trading One Member PLC specializes in the export of premium spices and legumes, backed by the proven expertise of our parent company, Tsion Alemayehu Import.
                </motion.p>
              </motion.div>
              <motion.div className="flex gap-4 pt-6" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="#products">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Explore Products
                    </Button>
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="#contact">
                    <Button size="lg" variant="outline" className="border-border bg-transparent">
                      Get In Touch
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              className="relative h-96 md:h-[480px] rounded-lg overflow-hidden"
              variants={slideRightVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src="/hero.png"
                alt="Premium spices collection"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Thak Trading Section */}
      <section id="about" className="py-20 px-6 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div className="space-y-12" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div className="space-y-4 max-w-2xl" variants={itemVariants}>
              <h2 className="text-4xl font-bold tracking-tight">About Thak Trading</h2>
              <p className="text-muted-foreground text-lg">
                Building on decades of proven trading expertise, Thak Trading One Member PLC specializes in premium spices and legumes for global markets. We maintain the same quality standards and reliability that made our parent company a trusted industry leader.
              </p>
            </motion.div>

            <motion.div className="grid md:grid-cols-2 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div className="space-y-4 bg-card p-8 rounded-lg border border-border" variants={scaleVariants} whileHover={{ scale: 1.02 }}>
                <h3 className="text-2xl font-bold">Our Mission</h3>
                <p className="text-muted-foreground">
                  To deliver the finest quality spices and legumes to discerning businesses worldwide. We source directly from premium Ethiopian organic farms and authentic local producers, ensuring every product meets rigorous international standards.
                </p>
              </motion.div>

              <motion.div className="space-y-4 bg-card p-8 rounded-lg border border-border" variants={scaleVariants} whileHover={{ scale: 1.02 }}>
                <h3 className="text-2xl font-bold">Our Promise</h3>
                <p className="text-muted-foreground">
                  Quality is non-negotiable. We work directly with verified suppliers, maintain strict quality controls at every stage, and ensure every shipment meets international food safety regulations. Your trust is our foundation.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Parent Company Section */}
      <section id="parent" className="py-20 px-6 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div className="space-y-12" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div className="space-y-2 max-w-2xl" variants={itemVariants}>

              <p className="text-secondary text-sm font-semibold tracking-widest uppercase">Our Heritage</p>
              <h2 className="text-4xl font-bold tracking-tight">Tsion Alemayehu Import</h2>
              <p className="text-muted-foreground text-lg pt-2">
                Our parent company with extensive experience serving global industries since its founding.
              </p>
            </motion.div>

            <motion.div className="grid md:grid-cols-2 gap-12 items-center" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div className="space-y-6" variants={itemVariants}>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Chemical Products</h3>
                  <p className="text-muted-foreground text-sm">Serving the Soap & Detergent industry with premium ingredients:</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-3">
                      <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                      PFAD (Palm Fatty Acid Distillate)
                    </li>
                    <li className="flex items-center gap-3">
                      <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                      Soap Noodles
                    </li>
                    <li className="flex items-center gap-3">
                      <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                      LABSA 96% (Linear Alkyl Benzene Sulfonic Acid)
                    </li>
                    <li className="flex items-center gap-3">
                      <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                      Caustic Soda
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Automotive Division</h3>
                  <p className="text-muted-foreground text-sm">Importation of Tyre from China</p>
                </div>
                <p className="text-xs text-muted-foreground pt-4 border-t border-border pt-6">
                  <span className="font-bold">Sourcing Regions:</span> China, Indonesia, UAE
                </p>
              </motion.div>

              <motion.div
                className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center"
                variants={scaleVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center space-y-4">
                  <div className="text-6xl">🏭</div>
                  <p className="text-lg font-bold">Industrial Excellence</p>
                  <p className="text-sm text-muted-foreground">Decades of Trading Expertise</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Products Section - Spices */}
      <section id="products" className="py-20 px-6 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div className="space-y-12" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div className="space-y-4" variants={itemVariants}>
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <h2 className="text-4xl font-bold tracking-tight">Premium Spices</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl">
                    Authentic, aromatic spices sourced from the finest growing regions. Carefully selected and quality-tested for optimal flavor and freshness.
                  </p>
                </div>

              </div>
            </motion.div>

            <motion.div className="grid md:grid-cols-2 gap-12 items-center" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div className="relative h-96 rounded-lg overflow-hidden" variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <Image
                  src="/premium.png"
                  alt="Premium Spices collection detail"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div className="space-y-6" variants={itemVariants}>
                  <div className="grid grid-cols-2 gap-4">
                  {[
                    'Ginger',
                    'Black Cumin',
                    'Coriander',
                    'Fenugreek',
                    'Cardamom',
                    'Black Pepper',
                    'Turmeric Finger'
                  ].map((spice, idx) => (
                    <motion.div
                      key={spice}
                      className="flex items-center gap-3 p-3 bg-card rounded border border-border hover:border-primary transition-colors"
                      whileHover={{ scale: 1.05 }}
                      onMouseEnter={() => setHoveredFeature(idx)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="font-medium">{spice}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Products Section - Pulses */}
      <section className="py-20 px-6 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div className="space-y-12" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div className="space-y-4" variants={itemVariants}>
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <h2 className="text-4xl font-bold tracking-tight">Quality Pulses & Legumes</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl">
                    Nutritious and versatile legumes perfect for food production, restaurants, and retail. All products meet international food safety standards.
                  </p>
                </div>

              </div>
            </motion.div>

            <motion.div className="grid md:grid-cols-2 gap-12 items-center" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div className="space-y-6" variants={itemVariants}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'Soya Bean',
                    'Pinto Bean',
                    'Chickpea',
                    'White Pea Bean',
                    'Red Kidney Bean',
                    'Green Mung Bean',
                    'White Pigeon Bean',
                    'Grass Peas',
                    'Fava Beans',
                    'Lupin Bean',
                    'Lentils'
                  ].map((pulse, idx) => (
                    <motion.div
                      key={pulse}
                      className="flex items-center gap-3 p-3 bg-background rounded border border-border hover:border-primary transition-colors"
                      whileHover={{ scale: 1.05 }}
                      onMouseEnter={() => setHoveredFeature(idx)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="font-medium">{pulse}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div className="relative h-96 rounded-lg overflow-hidden" variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <Image
                  src="/quality.png"
                  alt="Quality Legumes and pulses collection"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Slideshow Section */}
      <InfiniteScrollSlideshow />


      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div className="space-y-12" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div className="space-y-4 max-w-2xl" variants={itemVariants}>
              <h2 className="text-4xl font-bold tracking-tight">Why Choose Thak Trading</h2>
              <p className="text-muted-foreground text-lg">
                Backed by decades of industry expertise and a commitment to excellence.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '🔍', title: 'Verified Sources', desc: 'Direct partnerships with trusted local suppliers in Ethiopia, ensuring authentic products.' },
                { icon: '✓', title: 'Quality Assurance', desc: 'Rigorous testing at every stage. All products meet international food safety standards.' },
                { icon: '🚚', title: 'Reliable Delivery', desc: 'Efficient logistics with seamless international shipping and documentation handling.' },
                { icon: '💰', title: 'Competitive Pricing', desc: 'Premium quality at competitive prices through direct sourcing relationships.' },
                { icon: '👥', title: 'Expert Support', desc: 'Knowledgeable team for product selection, bulk orders, and custom requirements.' },
                { icon: '⚡', title: 'Flexibility', desc: 'Accommodate orders of any size with professional, reliable handling.' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="space-y-4 p-6 rounded-lg border border-border bg-card hover:border-primary transition-colors"
                  variants={scaleVariants}
                  whileHover={{ scale: 1.05 }}
                  onMouseEnter={() => setHoveredFeature(idx)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="text-4xl">{item.icon}</div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div className="space-y-12" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div className="space-y-4 max-w-2xl" variants={itemVariants}>
              <h2 className="text-4xl font-bold tracking-tight">Get In Touch</h2>
              <p className="text-muted-foreground text-lg">
                Ready to partner with us? We'd love to discuss your requirements and provide quotations for bulk orders.
              </p>
            </motion.div>

            <motion.div className="grid md:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.a
                href="mailto:info@thaktrading.com"
                className="flex items-start gap-4 p-6 bg-background rounded-lg border border-border hover:border-primary transition-colors"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground">Thaktrading@gmail.com</p>
                </div>
              </motion.a>

              <motion.a
                href="tel:+251944123456"
                className="flex items-start gap-4 p-6 bg-background rounded-lg border border-border hover:border-primary transition-colors"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Phone</h3>
                  <p className="text-sm text-muted-foreground">+251 9 8804 0588 / +251 9 8807 2630</p>
                </div>
              </motion.a>

              <motion.div
                className="flex items-start gap-4 p-6 bg-background rounded-lg border border-border hover:border-primary transition-colors"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Location</h3>
                  <p className="text-sm text-muted-foreground">Addis Ababa, Ethiopia</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div className="bg-background p-8 rounded-lg border border-border space-y-6" variants={itemVariants} whileInView="visible" initial="hidden">
              <h3 className="text-2xl font-bold">Request a Quotation</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <motion.input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary w-full"
                    whileFocus={{ scale: 1.01 }}
                  />
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary w-full"
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>
                <motion.input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
                  whileFocus={{ scale: 1.01 }}
                />
                <motion.textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirements..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                  whileFocus={{ scale: 1.01 }}
                />
                
                <div className="py-2">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'} // Fallback for dev only, user must update env
                    theme="light"
                  />
                </div>

                {statusMessage && (
                  <p className={`text-sm ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                    {statusMessage}
                  </p>
                )}

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="border-t border-border bg-card/50 backdrop-blur-sm py-12 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="grid md:grid-cols-4 gap-8 mb-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div className="space-y-3" variants={itemVariants}>
              <div className="text-xl font-bold">
                <span className="text-secondary">THAK</span> Trading
                <p className="text-xs text-muted-foreground font-normal pt-1">Sister of Tsion Alemayehu</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium spices and legumes for global markets.
              </p>
            </motion.div>
            <motion.div className="space-y-3" variants={itemVariants}>
              <h4 className="font-bold">Products</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li><a href="#products" className="hover:text-primary transition">Spices & Legumes</a></li>
                <li><a href="#products" className="hover:text-primary transition">View All Products</a></li>
              </ul>
            </motion.div>
            <motion.div className="space-y-3" variants={itemVariants}>
              <h4 className="font-bold">Company</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li><a href="#about" className="hover:text-primary transition">About Us</a></li>
                <li><a href="#parent" className="hover:text-primary transition">Tsion Alemayehu</a></li>
                <li><a href="#contact" className="hover:text-primary transition">Contact</a></li>
              </ul>
            </motion.div>
            <motion.div className="space-y-3" variants={itemVariants}>
              <h4 className="font-bold">Connect</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li><a href="mailto:Thaktrading@gmail.com" className="hover:text-primary transition flex items-center gap-2"><Mail className="w-3 h-3" /> Email</a></li>
                <li><a href="tel:+251988040588" className="hover:text-primary transition flex items-center gap-2"><Phone className="w-3 h-3" /> Phone</a></li>
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-4"
            variants={itemVariants}
          >
            <p>&copy; 2024 Thak Trading One Member PLC. All rights reserved.</p>
            <p className="text-primary font-semibold">Premium Trading Excellence</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}
