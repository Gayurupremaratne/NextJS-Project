import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EmergencyContactPayload } from '@/types/emergencyContact/emergencyContact.type';
import {
  GetEmergencyContacts,
  UpdateEmergencyContact,
} from '@/api/emergencyContacts/emergencyContact';

export const useGetEmergencyContacts = (userId: string) => {
  return useQuery({
    queryKey: ['emergencyContacts', userId],
    queryFn: async () => {
      const response = await GetEmergencyContacts(userId);
      return response;
    },
  });
};

export const useUpdateEmergencyContact = (userId: string) => {
  const client = useQueryClient();
  return useMutation(
    async (data: EmergencyContactPayload) => {
      const response = await UpdateEmergencyContact(userId, data);
      if (response.data.statusCode === 201) {
        return response.data;
      }
    },
    {
      // Rest of your options
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['emergencyContacts', userId] });
      },
    },
  );
};
