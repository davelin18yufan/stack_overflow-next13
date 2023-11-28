"use client"

import Image from "next/image"
import { deleteQuestion } from "@/lib/actions/question.action"
import { usePathname, useRouter } from "next/navigation"
import { deleteAnswer } from "@/lib/actions/answer.action"
import { toast } from "@/components/ui/use-toast"

interface Props {
  itemId: string
  type: string
}

const EditDeleteAction = ({ itemId, type }: Props) => {
  const pathname = usePathname()
  const router = useRouter()

  function handleEdit() {
    router.push(`/question/edit/${JSON.parse(itemId)}`)
  }

  async function handleDelete() {
    if (type === "Question") {
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathname })
      toast({
        title: "Question Delete Successfully",
        variant: "default"
      })
    }else if(type === "Answer"){
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathname })
      toast({
        title: "Answer Delete Successfully",
        variant: "default",
      })
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
