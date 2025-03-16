import HeadData from "../components/HeadData.tsx";
import LoginPage from "../islands/LoginPage.tsx";

export default function LoginPageWrapper()
{
    return (
        <>
            <head>
                <HeadData title="Login to Utilify"/>
            </head>
            <body>
                <LoginPage></LoginPage>
            </body>
        </>
    )
}