import { useQuery } from '@tanstack/react-query'
import { api } from '../src/api/api'

interface PostData {
  userId: number
  id: number
  title: string
  body: string
}

function usePosts() {
  return useQuery<PostData[]>({
    queryKey: ['posts'],
    queryFn: async () => await api('posts').json(),
  })
}

export default function PostsDemo() {
  const { isFetching, error, data } = usePosts();

  if (isFetching) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className='bg-pageBg text-white p-10 flex flex-col gap-4'>
      <h1 className='text-xl'>Posts</h1>
      {data?.slice(0, 20).map((item: PostData) => (
        <div key={item.id} className='w-[40%]'>
          <h2 className="font-bold text-lg">{item.title}</h2>
          <p className='text-gray-500'>{item.body}</p>
        </div>
      ))}
    </div>
  )
}
