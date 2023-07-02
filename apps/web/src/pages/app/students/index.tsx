import React from 'react';
import Layout from '@/core/layouts/AppLayout';
import { fetcher } from '@/lib/http/request';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateStudentModal } from '@/core/components/Modals/CreateStudentModal';
import { toast } from 'react-hot-toast';

const Student = () => {

  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: students } = useQuery({
    queryKey: ['allStudents'],
    queryFn: async () => fetcher({ resources: 'student' }),
  });

  const { mutate: deleteStudent } = useMutation({
    mutationFn: async (data: { uuid: string }) => fetcher({ resources: `student/${data.uuid}`, options: { method: "DELETE" } }),
    onSuccess: () => {
      toast.success('Student succesfully removed')
      queryClient.invalidateQueries(['allStudents'])
    }
  })

  React.useEffect(() => {
    if (students) {
      console.log(students);
    }
  });

  const handleCreateStudent = () => {
    setIsOpen(true);
  };

  const handleRemoveStudent = (studentUuid: string) => {
    deleteStudent({
      uuid: studentUuid
    })
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Students</h1>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md"
            onClick={handleCreateStudent}
          >
            Create New Student
          </button>
        </div>
        {students?.length !== 0 ? (
          students?.map((student) => (
            <div key={student.uuid} className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="text-lg font-bold">{student.name}</div>
              <div className="text-gray-500">{student.email}</div>
              <div className="flex justify-end mt-2 items-center">
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleRemoveStudent(student.uuid)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-lg">Create your first student</p>
          </div>
        )}
      </div>
      {isOpen && <CreateStudentModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </Layout>
  );
};

export default Student;
