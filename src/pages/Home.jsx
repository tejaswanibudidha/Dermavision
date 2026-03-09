import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Stethoscope, Activity, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
	return (
		<div className="overflow-x-hidden">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-24 lg:py-32 overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
					<div className="text-center max-w-4xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-6">
								AI-Powered Dermatology
							</span>
							<h1 className="text-5xl md:text-7xl font-extrabold text-primary-900 tracking-tight mb-8 leading-tight font-display">
								Your Personal <br />
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
									Skin Health Assistant
								</span>
							</h1>
						</motion.div>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-xl md:text-2xl text-secondary-600 mb-12 max-w-2xl mx-auto leading-relaxed"
						>
							Upload a photo and get instant AI analysis with professional medical insights. Early detection for better prevention.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="flex flex-col sm:flex-row gap-4 justify-center items-center"
						>
							<Link to="/upload" className="group relative px-8 py-4 bg-primary-600 text-white font-bold rounded-full overflow-hidden shadow-lg hover:shadow-primary-500/30 transition-all hover:-translate-y-1">
								<span className="relative z-10 flex items-center gap-2">
									Start Free Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</span>
								<div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity" />
							</Link>
							<Link to="/about" className="px-8 py-4 bg-white text-primary-900 font-bold rounded-full border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all hover:-translate-y-1">
								Learn More
							</Link>
						</motion.div>
					</div>
				</div>

				{/* Decorative Elements */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
					<motion.div
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.3, 0.5, 0.3]
						}}
						transition={{ duration: 8, repeat: Infinity }}
						className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-200 rounded-full blur-[100px] opacity-30"
					/>
					<motion.div
						animate={{
							scale: [1, 1.1, 1],
							opacity: [0.3, 0.4, 0.3]
						}}
						transition={{ duration: 10, repeat: Infinity, delay: 2 }}
						className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-[100px] opacity-30"
					/>
				</div>
			</section>

			{/* Stats/Trust Section (Optional Addition) */}
			<section className="py-10 bg-white border-y border-slate-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
						{[
							{ label: "AI Accuracy", value: "95%" },
							{ label: "Users Trusted", value: "2k+" },
							{ label: "Diseases Detected", value: "4+" },
							{ label: "Analysis Time", value: "< 5s" }
						].map((stat, idx) => (
							<div key={idx}>
								<div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
								<div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-24 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-20">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-4xl font-bold text-primary-900 mb-6"
						>
							Why Choose DermaVision?
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className="text-xl text-secondary-600 max-w-2xl mx-auto"
						>
							Advanced technology meets medical expertise to provide you with accurate, timely, and actionable skin health insights.
						</motion.p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								icon: <Zap className="w-8 h-8" />,
								title: "Lightning Fast Detection",
								desc: "Get comprehensive results in seconds. Our optimized AI model processes images instantly to provide quick peace of mind.",
							},
							{
								icon: <Shield className="w-8 h-8" />,
								title: "Clinical-Grade Accuracy",
								desc: "Trained on thousands of validated clinical images, our deep learning algorithms offer high-accuracy screenings comparable to experts.",
							},
							{
								icon: <Stethoscope className="w-8 h-8" />,
								title: "Actionable Medical Advice",
								desc: "Don't just get a label. Receive preliminary precautions, dietary suggestions, and next steps tailored to your specific condition.",
							}
						].map((feature, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 + 0.2 }}
								whileHover={{ y: -8 }}
								className="group p-8 rounded-2xl bg-white border border-secondary-100 shadow-xl shadow-secondary-200/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300"
							>
								<div className={`w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
									{feature.icon}
								</div>
								<h3 className="text-2xl font-bold text-primary-900 mb-4">{feature.title}</h3>
								<p className="text-secondary-600 leading-relaxed text-lg">{feature.desc}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Preview */}
			<section className="py-24 bg-primary-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-16 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
						>
							<h2 className="text-4xl font-bold text-primary-900 mb-6">Simple Steps to Better Skin Health</h2>
							<p className="text-xl text-secondary-600 mb-8">
								Using DermaVision is as easy as taking a selfie. No complex medical jargon, just clear answers.
							</p>

							<div className="space-y-6">
								{[
									"Take a clear photo of the affected area",
									"Upload securely to our encrypted platform",
									"Receive instant analysis and recommendations"
								].map((item, idx) => (
									<div key={idx} className="flex items-center gap-4">
										<CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0" />
										<span className="text-lg text-primary-900 font-medium">{item}</span>
									</div>
								))}
							</div>

						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="relative"
						>
							<div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-primary-800 rounded-3xl transform rotate-3 scale-95 opacity-20 blur-xl"></div>
							<div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-secondary-100">
								{/* Abstract UI Representation */}
								<div className="space-y-4">
									<div className="h-40 bg-secondary-100 rounded-xl w-full flex items-center justify-center text-secondary-400">
										<Activity className="w-8 h-8" />
									</div>
									<div className="h-4 bg-secondary-100 rounded-full w-3/4"></div>
									<div className="h-4 bg-secondary-100 rounded-full w-1/2"></div>
									<div className="flex gap-2 pt-4">
										<div className="h-10 bg-primary-100 rounded-lg w-full"></div>
										<div className="h-10 bg-secondary-100 rounded-lg w-full"></div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			<footer className="bg-primary-900 border-t border-primary-700">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="grid md:grid-cols-4 gap-10 pb-8 border-b border-primary-700">
						<div>
							<h3 className="text-xl font-bold text-white mb-4">Derma Vision</h3>
							<p className="text-primary-100 leading-relaxed">
								AI-powered skin analysis platform helping users detect skin conditions early and get suggestions.
							</p>
						</div>

						<div>
							<h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
							<div className="flex flex-col gap-3 text-primary-100">
								<Link to="/" className="hover:text-white transition-colors">Home</Link>
								<Link to="/#features" className="hover:text-white transition-colors">Features</Link>
								<Link to="/upload" className="hover:text-white transition-colors">Skin Analysis</Link>
								<Link to="/about" className="hover:text-white transition-colors">About</Link>
								<Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
							</div>
						</div>

						<div>
							<h3 className="text-xl font-bold text-white mb-4">Contact</h3>
							<div className="space-y-3 text-primary-100">
								<p>Phone: +91 98765 43210</p>
								<p>Email: support@dermavision.ai</p>
							</div>
						</div>

						<div>
							<h3 className="text-xl font-bold text-white mb-4">Location</h3>
							<p className="text-primary-100">Hyderabad, Telangana, India</p>
						</div>
					</div>

					<div className="py-6 border-b border-primary-700">
						<div className="flex flex-wrap items-center justify-center gap-3 text-primary-100 font-medium">
							<Link to="/" className="hover:text-white transition-colors">Home</Link>
							<span>|</span>
							<Link to="/#features" className="hover:text-white transition-colors">Features</Link>
							<span>|</span>
							<Link to="/upload" className="hover:text-white transition-colors">Skin Analysis</Link>
							<span>|</span>
							<Link to="/about" className="hover:text-white transition-colors">About</Link>
							<span>|</span>
							<Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
						</div>
					</div>

					<div className="pt-6 text-center text-primary-200 font-medium">
                        
					</div>
				</div>
			</footer>

		</div>
	);
};

export default Home;
