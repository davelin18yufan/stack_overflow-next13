"use client"

import Image from "next/image"
import { deleteQuestion } from "@/lib/actions/question.action"
import { usePathname, useRouter } from "next/navigation"
import { deleteAnswer } from "@/lib/actions/answer.action"

interface Props {
  itemId: string
  type: string
}

const EditDeleteAction = async ({ itemId, type }: Props) => {
  const pathname = usePathname()
  const router = useRouter()

  function handleEdit() {
    router.push(`/question/edit/${JSON.parse(itemId)}`)
  }

  async function handleDelete() {
    if (type === "Question") {
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathname })
    }else if(type === "Answer"){
      await deleteAnswer({answerId: itemId, path:pathname})
    }
  }
  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          onClick={handleEdit}
          className="cursor-pointer object-contain"
        />
      )}

      <Image
        src="/assets/icons/trash.svg"
        alt="delete"
        width={14}
        height={14}
        onClick={handleDelete}
        className="cursor-pointer object-contain"
      />
    </div>
  )
}

export default EditDeleteAction
