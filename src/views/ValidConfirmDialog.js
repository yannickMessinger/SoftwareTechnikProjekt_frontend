
import SimpleDialog from "../components/SimpleDialog.vue";
import { createConfirmDialog } from "vuejs-confirm-dialog";

const useValidConfirmBeforeAction = (action, props) => {
  const { reveal, onConfirm } = createConfirmDialog(SimpleDialog, props);

  onConfirm(action);

  reveal();
};

export { useValidConfirmBeforeAction };