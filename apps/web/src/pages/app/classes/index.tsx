import Layout from '@/core/layouts/AppLayout';
import { fetcher } from '@/lib/http/request';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useRouter } from 'next/router';
import { CreateClassModal } from '@/core/components/Modals/CreateClasseModal';
import { toast } from 'react-hot-toast';



const Classe = () => {
  const queryClient = useQueryClient()
  const { push } = useRouter()
  const { data } = useQuery({
    queryFn: async () => fetcher({ resources: "classe" }),
    queryKey: ['allClasse']
  });

  const { mutate } = useMutation({
    mutationFn: async (data: { uuid: string }) => fetcher({ resources: `classe/${data.uuid}`, options: { method: "DELETE" } }),
    onSuccess: () => {
      toast.success('Classe succefully deleted')
      queryClient.invalidateQueries(['allClasse'])
    }
  })

  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (data) {
      console.log(data);
    }
  });

  const handleRemoveClasse = (classeId) => {
    mutate({
      uuid: classeId
    })
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Classes</h1>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md"
            onClick={() => setIsOpen(true)}
          >
            Create New Classe
          </button>
        </div>
        {data?.length !== 0 ? (
          data?.map((classe) => (
            <div key={classe.uuid} className="flex justify-between items-center bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 onClick={() => push(`/app/classes/${classe.uuid}`)} className="text-xl font-bold">{classe.name}</h2>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
                onClick={() => handleRemoveClasse(classe.uuid)}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-lg">Create your first classe</p>
          </div>
        )}
      </div>
      {
        isOpen && <CreateClassModal isOpen={isOpen} setIsOpen={setIsOpen} />
      }
    </Layout>
  );
}

export default Classe;
