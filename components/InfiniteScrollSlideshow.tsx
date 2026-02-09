'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import Autoplay from 'embla-carousel-autoplay'

const slides = [
  {
    src: '/1.png',
    title: 'Linear Alkylbenzene Sulfonic Acid (LABSA)',
    description: 'A Versatile Surfactant'
  },
  {
    src: '/2.png',
    title: 'LABSA & SLES',
    description: 'High Quality Detergent Raw Materials'
  },
  {
    src: '/3.png',
    title: 'MSD Global',
    description: 'Palm Fatty Acid Distillate'
  }
]

export default function InfiniteScrollSlideshow() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null)

  // Auto-play plugin for Embla
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  )

  return (
    <div className="w-full bg-background/50 backdrop-blur-sm py-20">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="text-center space-y-4"
        >
          <h2 className="text-3xl font-bold tracking-tight">Our Gallery</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          <p className="text-muted-foreground">Premium products through our lens</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-12 md:px-16 lg:px-6"> 
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="w-full"
          opts={{
            align: 'start',
            loop: true,
          }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-4">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="overflow-hidden border-2 cursor-pointer group hover:border-primary transition-colors duration-300 h-full">
                        <CardContent className="flex h-[450px] items-center justify-center p-0 relative">
                          <Image
                            src={slide.src}
                            alt={slide.title}
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                            <div className="text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="font-bold text-xl">{slide.title}</h3>
                                <p className="text-sm text-gray-200">{slide.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    
                    {/* Lightbox / Full Screen View */}
                    <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
                      <div className="relative aspect-video w-full h-[80vh] bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
                         <Image
                          src={slide.src}
                          alt={slide.title}
                          fill
                          className="object-contain"
                          quality={100}
                         />
                         <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                            <h2 className="text-2xl font-bold">{slide.title}</h2>
                            <p className="text-lg opacity-90">{slide.description}</p>
                         </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="hidden md:flex -left-4 md:-left-12 opacity-70 hover:opacity-100 transition-opacity" />
          <CarouselNext className="hidden md:flex -right-4 md:-right-12 opacity-70 hover:opacity-100 transition-opacity" />
        </Carousel>
      </div>
    </div>
  )
}
