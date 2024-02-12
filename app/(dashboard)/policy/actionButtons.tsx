import { Button, Heading, Text } from '@/components/atomic';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import CustomCan from '@/components/casl/CustomCan';
import { UseParams } from '@/constants/useParams';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useGetStories } from '@/hooks/story/story';
import { IPolicy } from '@/types/policy/policy.type';
import { FormActions } from '@/constants/form-actions';
import { Edit2, MinusCirlce } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { GroupForm } from '@/components/policy-form/GroupForm';
import { PolicyForm } from '@/components/policy-form/PolicyForm';
import { AlertDialog } from '@/components/atomic/Modal';
import { theme } from '@/tailwind.config';
import { useDeletePolicy } from '@/hooks/policy/policy';
import { useQueryClient } from '@tanstack/react-query';
export interface Props {
  initialData: IPolicy;
}
const fetchDataOptions: UseParams = {
  pageNumber: 0,
  search: '',
  perPage: 15,
};

export const ActionButtons = ({ initialData }: Props) => {
  const [show, setShow] = useState(false);
  const { refetch } = useGetStories(fetchDataOptions);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const translation = initialData.policyTranslations?.find(
    t => t.localeId === 'en',
  );
  const deletePolicy = useDeletePolicy();

  useEffect(() => {
    refetch();
  }, [show, setShow]);

  const renderActionButtons = () => {
    return (
      <div className="flex justify-end items-end gap-x-6">
        <CustomCan a={Subject.PoliciesAndConditions} I={UserActions.Update}>
          <Button
            intent="ghost"
            onClick={() => setShow(true)}
            postIcon={<Edit2 size="16" variant="Bulk" />}
            size="ghost"
          />
        </CustomCan>
        <CustomCan a={Subject.PoliciesAndConditions} I={UserActions.Delete}>
          <Button
            intent="ghost"
            onClick={() => {
              setShowModal(true);
            }}
            postIcon={
              <MinusCirlce color={theme.colors.red} size="20" variant="Bulk" />
            }
            size={'ghost'}
          />
        </CustomCan>
      </div>
    );
  };
  const handleDelete = async () => {
    await deletePolicy.mutateAsync(initialData.id as string);
    queryClient.invalidateQueries(['allPolicies']);
  };

  return (
    <>
      {renderActionButtons()}
      {show && (
        <SlideOver
          setShow={value => setShow(value)}
          show={true}
          title={translation?.title as string}
        >
          {!initialData.isGroupParent ? (
            <PolicyForm
              action={FormActions.EDIT}
              initialData={initialData}
              setSlideOver={setShow}
            />
          ) : (
            <GroupForm
              action={FormActions.EDIT}
              initialData={initialData}
              setSlideOver={setShow}
            />
          )}
        </SlideOver>
      )}
      {showModal && (
        <AlertDialog
          buttonFunction={() => handleDelete()}
          buttontText="Delete"
          modalTitle="Delete policy"
          setShow={value => setShowModal(value)}
          show={showModal}
        >
          <Heading
            className="line-clamp-4"
            intent={'h6'}
          >{`Are you sure you want to delete "${translation?.title}"?`}</Heading>
          <Text
            className="text-tints-battleship-grey-tint-3 mt-2"
            size={'sm'}
            weight={'normal'}
          >
            {
              'You cannot undo this action. All text and information associated with this policy will be permanently deleted.'
            }
          </Text>
        </AlertDialog>
      )}
    </>
  );
};
