import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={100} 
              height={100} 
              className="h-10 w-40"
            />
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">
              Testimonials
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="ghost" className="text-gray-600 hover:bg-blue-50">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Ace Your Next Interview with <span className="text-blue-600">AI-Powered</span> Mock Practice
          </h1>
          <p className="text-lg text-gray-600">
            Get personalized mock interviews, AI feedback, and phone screening simulations 
            tailored to your dream job description.
          </p>
          <div className="flex space-x-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                Start Practicing
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="px-8">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0">
          <Image 
            src="/ai-interview.avif" // Replace with your hero image
            alt="AI Interview Practice"
            width={600}
            height={400}
            className="rounded-xl shadow-2xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Powerful Features to Help You Succeed</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Mock Interviews</h3>
              <p className="text-gray-600">
                Practice with AI tailored to specific job titles and descriptions from real companies.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Phone Screenings</h3>
              <p className="text-gray-600">
                Experience realistic technical screening calls with our AI interviewer.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Feedback</h3>
              <p className="text-gray-600">
                Get actionable insights on your answers, tone, and technical knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row mb-12 items-center">
              <div className="md:w-1/3 text-center md:text-right mb-6 md:mb-0 md:pr-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold">Select Your Target Role</h3>
              </div>
              <div className="md:w-2/3 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <p>Choose from our database of job titles or enter your own. Provide the job description for personalized practice.</p>
                <div className="mt-4 bg-gray-100 p-4 rounded-md">
                  <p className="text-sm text-gray-600 italic">E.g. "Frontend Developer at Google (React, TypeScript)"</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row mb-12 items-center">
              <div className="md:w-1/3 text-center md:text-right mb-6 md:mb-0 md:pr-8 order-2 md:order-1">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold">Practice with AI</h3>
              </div>
              <div className="md:w-2/3 bg-white p-6 rounded-xl shadow-md border border-gray-100 order-1 md:order-2 mb-6 md:mb-0">
                <p>Conduct mock interviews via text or voice. Our AI adapts to your responses with follow-up questions.</p>
                <div className="mt-4 bg-gray-100 p-4 rounded-md">
                  <p className="text-sm text-gray-600 italic">"Tell me about a time you solved a difficult technical challenge..."</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 text-center md:text-right mb-6 md:mb-0 md:pr-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold">Get Detailed Feedback</h3>
              </div>
              <div className="md:w-2/3 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <p>Receive scores on technical accuracy, communication, and problem-solving with actionable improvements.</p>
                <div className="mt-4 bg-gray-100 p-4 rounded-md">
                  <p className="text-sm text-gray-600 italic">"Your answer could better demonstrate impact by quantifying results..."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Nail Your Next Interview?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who landed their dream jobs
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-lg">
              Start Practicing
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}