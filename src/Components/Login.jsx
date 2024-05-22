import { Button, 
  FormControl, 
  FormErrorMessage, 
  FormLabel, 
  Input, 
  Modal, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  ModalOverlay,
  VStack
} from "@chakra-ui/react"
import PropTypes from "prop-types"
import { useEffect, useRef } from "react"
import useResponsive from "../hook/use-responsive"
import { useLogin } from "../hook/use-auth"
import { useForm } from "react-hook-form"

const Login = ({ isOpen, setIsOpen }) => {
  const initialRef = useRef(null)
  const finalRef = useRef(null)
  const { isMobile } = useResponsive()
  const { mutate, isPending, isSuccess } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  useEffect(() => {
    if (isSuccess) {
      reset()
      setIsOpen(false)
    }
  }, [isSuccess])

  const onSubmit = (data) => {
    console.log(data)
    mutate(data)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      isCentered
      motionPreset="slideInBottom"
      size={ isMobile ? 'full' : 'lg'}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
    >
      <VStack
        as='form'
        onSubmit={handleSubmit(onSubmit)}
        spacing={4}
      >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign In</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isInvalid={!!errors.username}>
            <FormLabel>Username</FormLabel>
            <Input 
              placeholder="Username" 
              ref={initialRef} 
              {...register('username', { required: 'Username is required' })}
              />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl mt={4} isInvalid={!!errors.email}>
            <FormLabel>Password</FormLabel>
            <Input 
              placeholder="Password" 
              type="password" 
              {...register('password', { required: 'Password is required' })}
              />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
        </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme='blue' isLoading={isPending}>Send</Button>
          </ModalFooter>
      </ModalContent>
      </VStack>
    </Modal>
  )
}

Login.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
}

export default Login
