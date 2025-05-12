import { UserContext } from "@/context/UserContext";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { JSX, useState } from "react";
import Toast, {
  ToastConfig,
  ToastConfigParams,
} from "react-native-toast-message";
import { RefreshDataContext } from "../context/RefreshDataContex";
import CustomToast from "../shared/CustomToast";

const toastConfig: ToastConfig = {
  custom: (props: ToastConfigParams<any>) => (
    <CustomToast
      text1={props.text1 || ""}
      text2={props.text2 || ""}
      {...props}
    />
  ),
};

export default function RootLayout(): JSX.Element {
  const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
  });
  const [user, setUser] = useState();
  const [refreshData, setRefreshData] = useState();
  return (
    <>
      <ConvexProvider client={convex}>
        <UserContext.Provider value={{ user, setUser }}>
          <RefreshDataContext.Provider value={{ refreshData, setRefreshData }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
            </Stack>
          </RefreshDataContext.Provider>
        </UserContext.Provider>
      </ConvexProvider>
      <Toast config={toastConfig} />
    </>
  );
}
