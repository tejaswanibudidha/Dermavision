import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Stethoscope, Activity, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCurrentUser } from '../services/api';

const Home = () => {
	const isLoggedIn = Boolean(getCurrentUser()?.id);
	const analysisLink = isLoggedIn ? '/upload' : '/login';
	const analysisLabel = isLoggedIn ? 'Start Free Analysis' : 'Login to Start Free Analysis';

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
							<Link to={analysisLink} className="group relative px-8 py-4 bg-primary-600 text-white font-bold rounded-full overflow-hidden shadow-lg hover:shadow-primary-500/30 transition-all hover:-translate-y-1">
								<span className="relative z-10 flex items-center gap-2">
									{analysisLabel} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
							{ label: "Diseases Detected", value: "4+" },
							{ label: "Analysis Time", value: "< 5s" },
							{ label: "User Friendly", value: "100%" }
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


			<section className="py-24 bg-gradient-to-br from-primary-50 to-secondary-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-4xl font-bold text-primary-900 mb-6"
						>
							Simple Steps to Better Health
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className="text-xl text-secondary-600 max-w-2xl mx-auto"
						>
							Our AI-powered skin analysis makes it easy to take control of your skin health. Follow these simple steps for instant insights.
						</motion.p>
					</div>

					<div className="grid lg:grid-cols-2 gap-16 items-center">
						<div className="space-y-8">
							{[
								{
									step: "01",
									title: "Choose a full skin frame",
									desc: "Use a photo that covers the whole affected area, minimizing background and occlusions.",
									icon: "📸"
								},
								{
									step: "02",
									title: "Analyze, get results",
									desc: "Receive disease name, confidence score, overview, precautions, and a diet plan from the model.",
									icon: "🤖"
								}
							].map((item, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: -50 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.2 }}
									className="flex items-start gap-6 p-6 rounded-2xl bg-white shadow-lg border border-secondary-100 hover:shadow-2xl transform hover:-translate-y-1 transition-all"
								>
									<div className="flex-shrink-0">
										<div className="w-18 h-18 bg-primary-100 rounded-full flex items-center justify-center text-3xl mb-2">
											{item.icon}
										</div>
										<div className="text-center">
											<span className="text-sm font-bold text-primary-600">{item.step}</span>
										</div>
									</div>
									<div>
										<h3 className="text-xl font-bold text-primary-900 mb-2">{item.title}</h3>
										<p className="text-secondary-600 leading-relaxed">{item.desc}</p>
									</div>
								</motion.div>
							))}
						</div>

						<motion.div
							initial={{ opacity: 0, x: 50, scale: 0.95 }}
							whileInView={{ opacity: 1, x: 0, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="relative"
						>
							<div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-primary-800 rounded-3xl transform rotate-3 scale-95 opacity-20 blur-xl animate-pulse"></div>
							<div className="relative bg-white p-10 rounded-3xl shadow-2xl border border-secondary-100">
								{/* AI Bot Illustration */}
								<div className="text-center">
									<motion.div
										animate={{
											scale: [1, 1.1, 1],
											rotate: [0, 2, -2, 0]
										}}
										transition={{
											duration: 4,
											repeat: Infinity,
											ease: 'easeInOut'
										}}
										className="w-44 h-44 md:w-56 md:h-56 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-sky-500 rounded-full flex items-center justify-center text-7xl shadow-2xl"
									>
										🤖
									</motion.div>
									<h3 className="text-3xl font-bold text-primary-900 mb-4">AI Skin Analysis Bot</h3>
									<p className="text-secondary-600 mb-6">
										Advanced HAM10000 style analysis with improved visual insights and crisp interface.
									</p>
									<div className="flex justify-center space-x-4">
										<motion.span animate={{ y: [0, -12, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0 }} className="w-3 h-3 bg-indigo-500 rounded-full"></motion.span>
										<motion.span animate={{ y: [0, -12, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.3 }} className="w-3 h-3 bg-blue-400 rounded-full"></motion.span>
										<motion.span animate={{ y: [0, -12, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.6 }} className="w-3 h-3 bg-cyan-400 rounded-full"></motion.span>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

		</div>
	);
};

export default Home;
