import HeadData from "../components/HeadData.tsx";
import SignUpPage from "../islands/SignUpPage.tsx";

export default function SignUpWrapper()
{
    return (
        <>
            <head>
                <HeadData title="Sign Up to Utilify"/>
            </head>
            <body class="bg-grid bg-gray-1000">
                <SignUpPage></SignUpPage>
            </body>
        </>
    )
}