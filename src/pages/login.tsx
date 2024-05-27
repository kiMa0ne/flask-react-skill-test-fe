import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"

const Login = () => {

  const { data: session } = useSession()

  // useEffect(() => {
  //   axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`, {username: "admin", password: "1234"}).then(response => {
  //     console.log(response)
  //   })
  // }, [])

  const form = useForm()
  const onSubmit = async (data: any) => {
    console.log(data)
    await signIn('credentials', {
      username: data.username,
      password: data.password,
      // redirect: true,
      // callbackUrl: "/"
    })
  }

  return (
    <div className="login-form-container px-5 w-1/3">

      <Button onClick={() => console.log(session)}>TEST</Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <Button onClick={() => signOut()}>LOGOUT</Button>
    </div>
  )

}

export default Login