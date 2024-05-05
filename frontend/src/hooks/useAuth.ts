import { useMutation, useQuery } from "@tanstack/react-query";
import { LoginService } from "../client/services/loginService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPublic } from "../client/models/user";
import { UserService } from "../client/services/userService";
import { AccessTokenRequestBody } from "../client/models/token";
import { ApiError } from "../client/models/apiError";
import { AxiosError, AxiosPromise } from "axios";
import { useToast } from "@chakra-ui/react";

const isLoggedIn = () => {
  return localStorage.getItem("accessToken") !== null
}

const isAdminLoggedIn = async () => {
  const user = (await UserService.readUserMe()).data
  return user.is_superuser
}


export function useAuth() {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const toast = useToast()

  const { data: user, isLoading } = useQuery<AxiosPromise<UserPublic | null, Error>>({
    queryKey: ["currentUser"],
    queryFn: UserService.readUserMe,
    enabled: isLoggedIn(),
  })

  const performLogin = async (data: AccessTokenRequestBody) => {
    const response = await LoginService.loginAccessToken({
      formData: data,
    })
    localStorage.setItem("accessToken", response.data.access_token)
  }

  const performLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("userData")
    navigate("/login")
  }

  const loginMutation = useMutation({
    mutationFn: performLogin,
    onSuccess: async () => {
      const user = (await UserService.readUserMe()).data
      localStorage.setItem("userData", JSON.stringify(user))
      navigate("/")
    },
    onError: (err: ApiError) => {
      let errorMessage = (err.body as any)?.detail

      if (err instanceof AxiosError) {
        errorMessage = err.response?.status == 422 ? "Please fill username and password" : "Wrong username or password"
      }

      if (Array.isArray(errorMessage)) {
        errorMessage = "Something went wrong"
      }

      setError(errorMessage)

      toast({
        title: "Login Error",
        description: errorMessage,
        isClosable: true,
        duration: 3000,
        colorScheme: "red",
        position: "top",
      })
    },
  })

  return {
    loginMutation,
    performLogout,
    user,
    isLoading,
    error,
    resetError: () => setError(null),
  }
}

export { isLoggedIn, isAdminLoggedIn }
export default useAuth
