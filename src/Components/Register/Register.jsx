import { 
  Input, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter, 
  Button, 
  FormControl, 
  FormLabel,
  VStack,
  FormErrorMessage
} from "@chakra-ui/react"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import style from './Register.module.css'
import PropTypes from "prop-types"
import { useEffect, useRef, useState } from "react"
import useResponsive from "../../hook/use-responsive"
import { useRegister } from "../../hook/use-auth"
import { useForm } from "react-hook-form"

const Register = ({ isOpen, setIsOpen, setIsOpenLogin }) => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const initialRef = useRef(null)
  const finalRef = useRef(null)
  const { isMobile } = useResponsive()
  const { mutate: registerUser, isPending, isSuccess } = useRegister()

    const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onSubmit = (data) => {
    console.log(data)
    registerUser(data)
  }

  useEffect(() => {
    if (isSuccess) {
      reset()
      setIsOpen(false)
      setIsOpenLogin(true)
    }
  }, [isSuccess, reset, setIsOpen, setIsOpenLogin])

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isCentered
      motionPreset="slideInBottom"
      size={ isMobile ? 'full' : 'lg'}
    >
      <VStack
        as='form'
        onSubmit={handleSubmit(onSubmit)}
        spacing={4}
      >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign Up</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
            <FormControl isInvalid={!!errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder='Username' 
                ref={initialRef} 
                {...register('username', { required: 'Username is required' })}
                />
                <FormErrorMessage>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input 
                placeholder='johnDoe@example.com' 
                type='email'
                {...register('email', { required: 'Email is required' })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <div className={style['container-input']}>
                <Input 
                  placeholder='Your password' 
                  type={isShowPassword ? 'text' : 'password'}
                  ref={finalRef}
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

Register.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  setIsOpenLogin: PropTypes.func,
}

export default Register
