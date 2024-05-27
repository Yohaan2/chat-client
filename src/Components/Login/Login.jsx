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
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import style from './Login.module.css'
import PropTypes from "prop-types"
import { useEffect, useRef, useState } from "react"
import useResponsive from "../../hook/use-responsive"
import { useLogin } from "../../hook/use-auth"
import { useForm } from "react-hook-form"

const Login = ({ isOpen, setIsOpen }) => {
  const [isShowPassword, setIsShowPassword] = useState(false)
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
  }, [isSuccess, reset, setIsOpen])

  const onSubmit = (data) => {
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
            <div className={style['container-input']}>
              <Input 
                placeholder="Password" 
                type={isShowPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                className={style['input-password']}
              />
                {
                  isShowPassword ? (
                    <ViewIcon className={style['view-icon']} boxSize={5} cursor={'pointer'} onClick={() => setIsShowPassword(!isShowPassword)}/>
                  ) : (
                    <ViewOffIcon className={style['view-icon']} boxSize={5} cursor={'pointer'} onClick={() => setIsShowPassword(!isShowPassword)}/>
                  )
                }
            </div>
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
