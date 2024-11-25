
dispatch({

    type: "ADD_TOAST",

    toast: {

      ...props,

      id,

      open: true,

      onOpenChange: (open) => {

        if (!open) dismiss()

      },

    },

  })


  return {

    id: id,

    dismiss,

    update,

  }

}


function useToast() {

  const [state, setState] = React.useState<State>(memoryState)


  React.useEffect(() => {

    listeners.push(setState)

    return () => {

      const index = listeners.indexOf(setState)

      if (index > -1) {

        listeners.splice(index, 1)

      }

    }

  }, [state])


  return {

    ...state,

    toast,

    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),

  }

}


export { useToast, toast }