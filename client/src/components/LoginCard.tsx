import React, { useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	TextField,
	Button,
	Alert,
	CircularProgress,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface Props {
	onAuthSuccess: (user: { id: number; email: string }) => void;
}

const LoginCard: React.FC<Props> = ({ onAuthSuccess }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim() || !password.trim()) return;

		setLoading(true);
		setError(null);

		try {
			const response = await fetch("http://localhost:8080/api/auth", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			let data;
			const contentType = response.headers.get("content-type");
			if (contentType && contentType.includes("application/json")) {
				data = await response.json();
			} else {
				const text = await response.text();
				throw new Error(text || `Request failed with status ${response.status}`);
			}

			if (!response.ok) {
				throw new Error(data?.error || "Authentication failed. Try again.");
			}

			// Save user session and invoke top-level success trigger
			onAuthSuccess(data);
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : "Could not reach Ollama Studio backend.";
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "radial-gradient(circle at 50% 50%, #1e1b4b 0%, #0f1115 100%)",
				px: 3,
			}}
		>
			<Card
				sx={{
					maxWidth: 420,
					width: "100%",
					borderRadius: "24px",
					bgcolor: "rgba(24, 27, 33, 0.65)",
					backdropFilter: "blur(20px)",
					border: "1px solid rgba(255, 255, 255, 0.08)",
					boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
				}}
			>
				<CardContent sx={{ p: 4, textAlign: "center" }}>
					{/* Logo Accent */}
					<Box
						sx={{
							width: 56,
							height: 56,
							borderRadius: "16px",
							background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
							mb: 3,
						}}
					>
						<AutoAwesomeIcon sx={{ color: "#fff", fontSize: "1.8rem" }} />
					</Box>

					{/* Title Header */}
					<Typography
						variant="h4"
						sx={{
							fontWeight: 800,
							fontFamily: '"Plus Jakarta Sans", sans-serif',
							letterSpacing: "-0.02em",
							mb: 1,
							background: "linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
						}}
					>
						Ollama Studio
					</Typography>
					<Typography variant="body2" sx={{ color: "text.secondary", mb: 4, fontWeight: 500 }}>
						Enter your email & password to register or log in.
					</Typography>

					{/* Error alert Banner */}
					{error && (
						<Alert
							severity="error"
							sx={{
								mb: 3,
								borderRadius: "12px",
								textAlign: "left",
								border: "1px solid rgba(239, 68, 68, 0.2)",
								bgcolor: "rgba(239, 68, 68, 0.05)",
								color: "#ef4444",
								"& .MuiAlert-icon": { color: "#ef4444" },
							}}
						>
							{error}
						</Alert>
					)}

					{/* Credentials Form */}
					<Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
						<TextField
							fullWidth
							label="Email Address"
							type="email"
							variant="outlined"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={loading}
							required
							sx={{
								"& .MuiOutlinedInput-root": {
									borderRadius: "12px",
								},
							}}
						/>
						<TextField
							fullWidth
							label="Password"
							type="password"
							variant="outlined"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
							required
							sx={{
								"& .MuiOutlinedInput-root": {
									borderRadius: "12px",
								},
							}}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							size="large"
							disabled={loading}
							sx={{
								py: 1.5,
								mt: 1.5,
								fontSize: "0.98rem",
								fontWeight: 700,
								borderRadius: "12px",
								background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
								boxShadow: "0 4px 16px rgba(99, 102, 241, 0.25)",
								"&:hover": {
									background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
									boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
								},
							}}
						>
							{loading ? <CircularProgress size={24} color="inherit" /> : "Enter Workspace"}
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
};

export default LoginCard;
