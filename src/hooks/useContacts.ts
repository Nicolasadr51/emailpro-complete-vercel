// Hook spécialisé pour la gestion des contacts
import { useCallback, useMemo } from 'react';
import { useApi, usePaginatedApi, useMutation } from './useApi';
import { contactsApi } from '@/services/api';
import type {
  Contact,
  ContactStatus,
  ContactList,
  ContactSegment,
  CreateContactRequest,
  UpdateContactRequest,
  CreateContactListRequest,
  UpdateContactListRequest,
  ImportResult
} from '@/types/contact';
import type { BaseQueryParams } from '@/types/api';

// Paramètres de requête spécifiques aux contacts
interface ContactQueryParams extends BaseQueryParams {
  status?: ContactStatus;
  listId?: string;
  tags?: string[];
  segmentId?: string;
  source?: string;
  hasActivity?: boolean;
  lastActivityBefore?: Date;
  lastActivityAfter?: Date;
}

// Hook principal pour les contacts
export function useContacts(params?: ContactQueryParams) {
  const {
    data: contacts,
    total,
    page,
    limit,
    totalPages,
    hasMore,
    isLoading,
    error,
    isSuccess,
    execute,
    setPage,
    setLimit,
    loadMore,
    refresh,
    reset
  } = usePaginatedApi(
    (queryParams) => contactsApi.getContacts(queryParams),
    {
      immediate: true,
      initialPage: 1,
      initialLimit: 25
    }
  );

  // Exécuter avec les nouveaux paramètres
  const refetch = useCallback((newParams?: ContactQueryParams) => {
    execute({ ...params, ...newParams });
  }, [execute, params]);

  // Statistiques calculées
  const stats = useMemo(() => {
    if (!contacts.length) {
      return {
        total: 0,
        active: 0,
        unsubscribed: 0,
        bounced: 0,
        complained: 0
      };
    }

    return contacts.reduce((acc, contact) => {
      acc.total++;
      acc[contact.status as keyof typeof acc]++;
      return acc;
    }, {
      total: 0,
      active: 0,
      unsubscribed: 0,
      bounced: 0,
      complained: 0
    });
  }, [contacts]);

  return {
    contacts,
    total,
    page,
    limit,
    totalPages,
    hasMore,
    isLoading,
    error,
    isSuccess,
    stats,
    setPage,
    setLimit,
    loadMore,
    refresh,
    refetch,
    reset
  };
}

// Hook pour un contact spécifique
export function useContact(id: string) {
  const {
    data: contact,
    isLoading,
    error,
    isSuccess,
    execute,
    refresh,
    reset
  } = useApi(
    () => contactsApi.getContact(id),
    {
      immediate: !!id,
      transform: (data) => data
    }
  );

  return {
    contact,
    isLoading,
    error,
    isSuccess,
    refresh,
    reset,
    refetch: execute
  };
}

// Hook pour l'activité d'un contact
export function useContactActivity(id: string, params?: BaseQueryParams) {
  const {
    data: activities,
    total,
    page,
    limit,
    totalPages,
    hasMore,
    isLoading,
    error,
    isSuccess,
    setPage,
    setLimit,
    loadMore,
    refresh
  } = usePaginatedApi(
    (queryParams) => contactsApi.getContactActivity(id, queryParams),
    {
      immediate: !!id,
      initialPage: 1,
      initialLimit: 20
    }
  );

  return {
    activities,
    total,
    page,
    limit,
    totalPages,
    hasMore,
    isLoading,
    error,
    isSuccess,
    setPage,
    setLimit,
    loadMore,
    refresh
  };
}

// Hook pour la création de contact
export function useCreateContact() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    data,
    reset
  } = useMutation(
    (data: CreateContactRequest) => contactsApi.createContact(data)
  );

  const createContact = useCallback(async (contactData: CreateContactRequest) => {
    return mutateAsync(contactData);
  }, [mutateAsync]);

  return {
    createContact,
    mutate,
    isLoading,
    error,
    isSuccess,
    contact: data,
    reset
  };
}

// Hook pour la mise à jour de contact
export function useUpdateContact() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    data,
    reset
  } = useMutation(
    ({ id, data }: { id: string; data: UpdateContactRequest }) => 
      contactsApi.updateContact(id, data)
  );

  const updateContact = useCallback(async (id: string, contactData: UpdateContactRequest) => {
    return mutateAsync({ id, data: contactData });
  }, [mutateAsync]);

  return {
    updateContact,
    mutate,
    isLoading,
    error,
    isSuccess,
    contact: data,
    reset
  };
}

// Hook pour la suppression de contact
export function useDeleteContact() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    reset
  } = useMutation(
    (id: string) => contactsApi.deleteContact(id)
  );

  const deleteContact = useCallback(async (id: string) => {
    return mutateAsync(id);
  }, [mutateAsync]);

  return {
    deleteContact,
    mutate,
    isLoading,
    error,
    isSuccess,
    reset
  };
}

// Hook pour la suppression multiple de contacts
export function useDeleteContacts() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    data,
    reset
  } = useMutation(
    (ids: string[]) => contactsApi.deleteContacts(ids)
  );

  const deleteContacts = useCallback(async (ids: string[]) => {
    return mutateAsync(ids);
  }, [mutateAsync]);

  return {
    deleteContacts,
    mutate,
    isLoading,
    error,
    isSuccess,
    result: data,
    reset
  };
}

// Hook pour les actions de contact (subscribe/unsubscribe)
export function useContactActions() {
  const unsubscribe = useMutation(
    (id: string) => contactsApi.unsubscribeContact(id)
  );

  const resubscribe = useMutation(
    (id: string) => contactsApi.resubscribeContact(id)
  );

  const addTags = useMutation(
    ({ id, tags }: { id: string; tags: string[] }) => 
      contactsApi.addTagsToContact(id, tags)
  );

  const removeTags = useMutation(
    ({ id, tags }: { id: string; tags: string[] }) => 
      contactsApi.removeTagsFromContact(id, tags)
  );

  const unsubscribeContact = useCallback(async (id: string) => {
    return unsubscribe.mutateAsync(id);
  }, [unsubscribe.mutateAsync]);

  const resubscribeContact = useCallback(async (id: string) => {
    return resubscribe.mutateAsync(id);
  }, [resubscribe.mutateAsync]);

  const addTagsToContact = useCallback(async (id: string, tags: string[]) => {
    return addTags.mutateAsync({ id, tags });
  }, [addTags.mutateAsync]);

  const removeTagsFromContact = useCallback(async (id: string, tags: string[]) => {
    return removeTags.mutateAsync({ id, tags });
  }, [removeTags.mutateAsync]);

  const isLoading = unsubscribe.isLoading || resubscribe.isLoading || 
                   addTags.isLoading || removeTags.isLoading;
  const error = unsubscribe.error || resubscribe.error || 
               addTags.error || removeTags.error;

  return {
    unsubscribeContact,
    resubscribeContact,
    addTagsToContact,
    removeTagsFromContact,
    isLoading,
    error,
    reset: () => {
      unsubscribe.reset();
      resubscribe.reset();
      addTags.reset();
      removeTags.reset();
    }
  };
}

// Hook pour l'import de contacts
export function useImportContacts() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    data,
    reset
  } = useMutation<ImportResult, {
    file: File;
    options?: {
      listId?: string;
      mapping?: Record<string, string>;
      updateExisting?: boolean;
      source?: string;
    };
    onProgress?: (progress: number) => void;
  }>(
    async ({ file, options, onProgress }) => {
      // Cette fonction utilise directement l'API car elle nécessite un traitement spécial pour l'upload
      return contactsApi.importContacts(file, options, onProgress);
    }
  );

  const importContacts = useCallback(async (
    file: File,
    options?: {
      listId?: string;
      mapping?: Record<string, string>;
      updateExisting?: boolean;
      source?: string;
    },
    onProgress?: (progress: number) => void
  ) => {
    return mutateAsync({ file, options, onProgress });
  }, [mutateAsync]);

  return {
    importContacts,
    mutate,
    isLoading,
    error,
    isSuccess,
    result: data,
    reset
  };
}

// Hook pour les listes de contacts
export function useContactLists(params?: BaseQueryParams) {
  const {
    data: lists,
    total,
    page,
    limit,
    totalPages,
    hasMore,
    isLoading,
    error,
    isSuccess,
    execute,
    setPage,
    setLimit,
    loadMore,
    refresh,
    reset
  } = usePaginatedApi(
    (queryParams) => contactsApi.getContactLists(queryParams),
    {
      immediate: true,
      initialPage: 1,
      initialLimit: 25
    }
  );

  return {
    lists,
    total,
    page,
    limit,
    totalPages,
    hasMore,
    isLoading,
    error,
    isSuccess,
    setPage,
    setLimit,
    loadMore,
    refresh,
    refetch: execute,
    reset
  };
}

// Hook pour une liste de contacts spécifique
export function useContactList(id: string) {
  const {
    data: list,
    isLoading,
    error,
    isSuccess,
    execute,
    refresh,
    reset
  } = useApi(
    () => contactsApi.getContactList(id),
    {
      immediate: !!id,
      transform: (data) => data
    }
  );

  return {
    list,
    isLoading,
    error,
    isSuccess,
    refresh,
    reset,
    refetch: execute
  };
}

// Hook pour la gestion des listes
export function useContactListManagement() {
  const createList = useMutation(
    (data: CreateContactListRequest) => contactsApi.createContactList(data)
  );

  const updateList = useMutation(
    ({ id, data }: { id: string; data: UpdateContactListRequest }) => 
      contactsApi.updateContactList(id, data)
  );

  const deleteList = useMutation(
    (id: string) => contactsApi.deleteContactList(id)
  );

  const addContactsToList = useMutation(
    ({ listId, contactIds }: { listId: string; contactIds: string[] }) => 
      contactsApi.addContactsToList(listId, contactIds)
  );

  const removeContactsFromList = useMutation(
    ({ listId, contactIds }: { listId: string; contactIds: string[] }) => 
      contactsApi.removeContactsFromList(listId, contactIds)
  );

  return {
    createList: createList.mutateAsync,
    updateList: (id: string, data: UpdateContactListRequest) => 
      updateList.mutateAsync({ id, data }),
    deleteList: deleteList.mutateAsync,
    addContactsToList: (listId: string, contactIds: string[]) => 
      addContactsToList.mutateAsync({ listId, contactIds }),
    removeContactsFromList: (listId: string, contactIds: string[]) => 
      removeContactsFromList.mutateAsync({ listId, contactIds }),
    isLoading: createList.isLoading || updateList.isLoading || 
               deleteList.isLoading || addContactsToList.isLoading || 
               removeContactsFromList.isLoading,
    error: createList.error || updateList.error || deleteList.error || 
           addContactsToList.error || removeContactsFromList.error
  };
}

// Hook pour les statistiques globales des contacts
export function useContactStats() {
  const {
    data: stats,
    isLoading,
    error,
    isSuccess,
    execute,
    refresh
  } = useApi(
    () => contactsApi.getContactStats(),
    {
      immediate: true
    }
  );

  return {
    stats,
    isLoading,
    error,
    isSuccess,
    refresh,
    refetch: execute
  };
}

// Export du hook composite principal
export function useContactManagement() {
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();
  const deleteContacts = useDeleteContacts();
  const contactActions = useContactActions();
  const importContacts = useImportContacts();
  const listManagement = useContactListManagement();

  return {
    create: createContact,
    update: updateContact,
    delete: deleteContact,
    deleteMultiple: deleteContacts,
    actions: contactActions,
    import: importContacts,
    lists: listManagement
  };
}