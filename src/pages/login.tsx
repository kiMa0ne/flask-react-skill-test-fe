import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"

const Login = () => {
  const router = useRouter()
  const { error } = router.query

  const form = useForm()

  const onSubmit = async (data: any) => {
    await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: true,
      callbackUrl: "/"
    })
  }

  return (
    <div className="login-form-container px-5 w-1/3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            defaultValue=""
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
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Button type="submit">Submit</Button>
            {typeof error === 'string' && decodeURIComponent(error).includes("401") && <p className="text-red-600">Wrong credentials</p>}
          </div>
        </form>
      </Form>
    </div>
  )

}

export default Login