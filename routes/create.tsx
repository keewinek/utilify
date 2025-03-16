import CreatePage from "../islands/CreatePage.tsx";

export default function CreatePageWrapper()
{
    return (
        <>
            <head>
                <title>Create project | Utilify</title>
            </head>
            <body class="bg-grid bg-gray-1000">
                <CreatePage/>
            </body>
        </>
    )
}