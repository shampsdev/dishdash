import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchCollectionFavorite,
  addtoFavorites,
  removeFromFavorites
} from '../api/collections.api';
import { Collection } from '../interfaces/collection.interface';
import { Card } from '@/modules/swipes/interfaces/card.interface';

export const useSaved = () => {
  const queryClient = useQueryClient();

  const {
    data: saved,
    isPending,
    error
  } = useQuery({
    queryKey: ['saved'],
    queryFn: fetchCollectionFavorite
  });

  const patchPlaces = (fn: (old: Card[]) => Card[]) => {
    queryClient.setQueryData<Collection | undefined>(['saved'], old =>
      old ? { ...old, places: fn(old.places) } : old
    );
  };

  const addMutation = useMutation({
    mutationFn: addtoFavorites,

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['saved'] });

      const prev = queryClient.getQueryData<Collection>(['saved']);

      patchPlaces(places =>
        places.find(p => p.id === id)
          ? places
          : [...places, { id } as Card]
      );

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['saved'], ctx.prev);
    },

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['saved'] })
  });

  const removeMutation = useMutation({
    mutationFn: removeFromFavorites,

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['saved'] });
      const prev = queryClient.getQueryData<Collection>(['saved']);

      patchPlaces(places => places.filter(p => p.id !== id));

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['saved'], ctx.prev);
    },

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['saved'] })
  });

  return {
    saved,
    isPending,
    error,
    addtoSaved: addMutation.mutate,
    removeFromSaved: removeMutation.mutate
  };
};
