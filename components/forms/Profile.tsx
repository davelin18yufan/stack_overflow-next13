"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { ProfileSchema } from "@/lib/validations"
import { usePathname, useRouter } from "next/navigation"
import { updateUser } from "@/lib/actions/user.action"
import { toast } from "../ui/use-toast"

interface Props {
  clerkId: string
  user: string // take the original userInfo in string of JSON
}

const Profile = ({ clerkId, user }: Props) => {
  const parsedUser = JSON.parse(user)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      portfolioWebsite: parsedUser.portfolioWebsite || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
    },
  })

   async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setIsSubmitting(true)
    
    try {
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          portfolioWebsite: values.portfolioWebsite,
          location: values.location,
          bio: values.bio
        },
        path: pathname
      })

      router.back()

      toast({
        title: "Profile edit successfully"
      })
    } catch (error) {
      console.log(error)
    }finally{
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-9 mt-9"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Full Name<span className="text-primary-500">*</span>
                </FormLabel>

                <FormControl className="mt-3.5">
                  <Input
                    {...field}
                    className="no-focus paragraph-regular background-lught800-dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Your name"
                  />
                </FormControl>

                {/* error msg */}
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Username<span className="text-primary-500">*</span>
                </FormLabel>

                <FormControl className="mt-3.5">
                  <Input
                    {...field}
                    className="no-focus paragraph-regular background-lught800-dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Your username"
                  />
                </FormControl>

                {/* error msg */}
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="portfolioWebsite"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Portfolio Link
                </FormLabel>

                {/* FormControl only accept single child Element */}
                <FormControl className="mt-3.5">
                  <>
                    <Input
                      type="url"
                      className="no-focus paragraph-regular background-lught800-dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                      placeholder="Your portfolio URL"
                      {...field}
                    />
                  </>
                </FormControl>

                {/* error msg */}
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Location<span className="text-primary-500">*</span>
                </FormLabel>

                {/* FormControl only accept single child Element */}
                <FormControl className="mt-3.5">
                  <>
                    <Input
                      className="no-focus paragraph-regular background-lught800-dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                      placeholder="Where are you from"
                      {...field}
                    />
                  </>
                </FormControl>

                {/* error msg */}
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Bio<span className="text-primary-500">*</span>
                </FormLabel>

                {/* FormControl only accept single child Element */}
                <FormControl className="mt-3.5">
                  <>
                    <Textarea
                      className="no-focus paragraph-regular background-lught800-dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                      placeholder="What's special about you?"
                      {...field}
                    />
                  </>
                </FormControl>

                {/* error msg */}
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className=" mt-7 primary-gradient w-fit !text-light-900 ml-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving" : "Save"}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default Profile
