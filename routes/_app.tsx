import { type PageProps } from "$fresh/server.ts";
import FixedFooter from "../components/FixedFooter.tsx";
import TopNav from "../components/TopNav.tsx";
export default function App({ Component }: PageProps) {
	return (
		<html>
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				<title>Utilify</title>

				<link rel="stylesheet" href="/styles.css" />
				<link rel="icon" href="/logo_bg.png" type="image/png" />
				<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet"/>
			</head>
			<body>
				<TopNav/>
				<Component/>
				<FixedFooter/>
			</body>
		</html>
	);
}
