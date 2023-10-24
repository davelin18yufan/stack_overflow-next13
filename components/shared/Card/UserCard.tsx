import Image from 'next/image'
import React from 'react'
import RenderTag from '../RenderTag'

interface Props {
  name: string,
  username: string,
  imgUrl: string,
  tags?: {
    _id: string,
    name:string
  }[]
}

const UserCard = ({imgUrl, username, name, tags}:Props) => {
  return (
    <div className="background-light900_dark200 w-[260px] p-[30px] flex flex-col justify-center items-center gap-5 rounded-xl">
      <div className="flex flex-col justify-center items-center font-inter gap-[18px]">
        <Image
          src={imgUrl}
          alt="picture"
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="text-center">
          <h3 className="h3-bold text-dark200_light900 mb-2">{name}</h3>
          <p className="body-regular text-[14px] text-dark500_light500">
            @{username}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {tags?.map((tag) => (
          <RenderTag _id={tag._id} name={tag.name} />
        ))}
      </div>
    </div>
  )
}

export default UserCard