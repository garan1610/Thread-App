import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";


const Layout = () => {
    const { isSignedIn } = useAuth();
    if (isSignedIn) {
        return <Redirect href="/" />
    }
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    )
}

export default Layout;