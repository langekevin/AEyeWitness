import { NextPage } from "next";
import { api } from "@/store/services/api";
import ImageComponent from '@/components/ImageComponent/ImageComponent';

const Home: NextPage = () => {

  const {
    data: fileList,
    error: fileListError,
    isLoading: fileListLoading,
    isFetching: fileListFetching
  } = api.useFetchImageListQuery();

  return (
    <>
      {
        fileList && fileList.length > 0 ?
        fileList?.map((item, idx)  => {
          return <ImageComponent key={idx} transaction={item.key} />
        })
      :
      <div>
        <h1>Nothing found</h1>
        <p>
          Come back later or upload images
        </p>
      </div>
      }
    </>
  )
}

export default Home;
