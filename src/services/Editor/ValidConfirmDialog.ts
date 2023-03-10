import SimpleDialog from "../../components/UI/SimpleDialog.vue"
import { createConfirmDialog } from "vuejs-confirm-dialog"

function useValidConfirmBeforeAction(action: any, props: any) {
    const { reveal, onConfirm } = createConfirmDialog(SimpleDialog, props)
    onConfirm(action)
    reveal()
}

export { useValidConfirmBeforeAction }
