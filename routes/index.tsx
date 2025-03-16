import { useSignal } from "@preact/signals";
import HeadData from "../components/HeadData.tsx";

export default function Home() {
	return (
		<>
			<head><HeadData/></head>
			<body>
				<h1>Make your life easiser.</h1>
			</body>
		</>
	);
}
