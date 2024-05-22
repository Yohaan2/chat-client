import { useToast } from "@chakra-ui/react";
import { register, login } from "../module/auth";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  const toast = useToast();
  const data = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast({
        title: "Registered",
        description: "We've created your account for you.",
        duration: 5000,
        isClosable: true,
        position: 'top-right',
        variant:'custom',
        containerStyle: {
          backgroundColor: '#047533',
          color: '#fff',
          borderRadius: '15px',
        },
      })
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
        variant:'custom',
        containerStyle: {
          backgroundColor: '#c53030',
          color: '#fff',
          borderRadius: '15px',
        },
      })
    }
  });
  return data
}

export const useLogin = () => {
  const toast = useToast();
  const data = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      window.location.reload()
      toast({
        title: "Logged in",
        description: "You're now logged in.",
        duration: 9000,
        isClosable: true,
        position: 'top-right',
        variant:'custom',
        containerStyle: {
          backgroundColor: '#047533',
          color: '#fff',
          borderRadius: '15px',
        },
      })
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-right',
        variant:'custom',
        containerStyle: {
          backgroundColor: '#c53030',
          color: '#fff',
          borderRadius: '15px',
        },
      })
    }
  });
  return data
};

export const useLogout = () => {
  return {
    logout: () => {
      localStorage.removeItem('token')
      window.location.reload()
    }
  }
};