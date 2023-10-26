"use client"

import React, { useRef, useState } from "react"
import { Editor } from "@tinymce/tinymce-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { QuestionSchema } from "@/lib/validations"
import { Badge } from "../ui/badge"
import Image from "next/image"
import { createQuestion } from "@/lib/actions/question.action"
import { usePathname, useRouter } from "next/navigation"
import useTheme from "@/context/ThemeProvider"

interface Props {
  mongoUserId: string
}

const type: any = "create"

const Question = ({ mongoUserId }: Props) => {
  const editorRef = useRef(null)
  const { mode } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: [],
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionSchema>) {
    setIsSubmitting(true)

    try {
      await createQuestion({
        title: values.title,
        content: values.explanation,
        tags: values.tags,
        author: JSON.parse(mongoUserId),
        path: pathname, // for revalidation
      })

      // navigate to home page
      router.push("/")
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleInputKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) {
    // make sure key event only function at tags
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault()

      const tagInput = e.target as HTMLInputElement
      const tagValue = tagInput.value.trim()

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters",
          })
        }

        // check the tag if is existed already within field
        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue])
          // reset
          tagInput.value = ""
          form.clearErrors("tags")
        } else {
          form.trigger() // Manually triggers form or input validation.
        }
      }
    }
  }

  function handleTagRemove(tag: string, field: any) {
    // don't mutate the state
    const newTags = field.value.filter((t: string) => t !== tag)

    form.setValue("tags", newTags)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control} // This object contains methods for registering components, and for internal props passing only, no access
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title<span className="text-primary-500">*</span>
              </FormLabel>

              <FormControl className="mt-3.5">
                <Input
                  {...field}
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>

              <FormDescription className="text-[0.8rem] dark:text-slate-400 body-regular mt-2.5 text-light-500">
                Be specific and imagine you're asking a question to another
                person.
              </FormDescription>

              {/* error msg */}
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detail explanation of your question?
                <span className="text-primary-500">*</span>
              </FormLabel>

              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor
                  }}
                  onBlur={field.onBlur} // save value once exit
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue=""
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                    ],
                    toolbar:
                      "undo redo | " +
                      "codesample | bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist",
                    content_style: "body { font-family:Inter; font-size:16px }",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "light",
                  }}
                />
              </FormControl>

              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>

              {/* error msg */}
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags<span className="text-primary-500">*</span>
              </FormLabel>

              {/* FormControl only accept single child Element */}
              <FormControl className="mt-3.5">
                <>
                  <Input
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add tags..."
                  />

                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: string) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick={() => handleTagRemove(tag, field)}
                        >
                          {tag}
                          <Image
                            src="/assets/icons/close.svg"
                            alt="Close icon"
                            width={12}
                            height={12}
                            className="cursor-pointer object-contain invert-0 dark:invert"
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>

              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>

              {/* error msg */}
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient wu-fit !text-light-900"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === "edit" ? "Editing..." : " Posting..."}</>
          ) : (
            <>{type === "edit" ? "Edit Question" : "Ask a Question"}</>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default Question
