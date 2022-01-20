import { all } from "redux-saga/effects";
import ChecklistSagas from "../page/checklist/redux-sagas/saga";
import ChecklistInitProcessSagas from "../page/checklistInitProcess/redux-sagas/saga";
import CheckListProcessSagas from "../page/checklistProcess/redux-sagas/saga";
import CheckListProcessingSagas from "../page/checklistProcessing/redux-sagas/saga";
import ClientSuppliersSagas from "../page/clientSupplier/redux-sagas/saga";
import EmployeeSagas from "../page/employee/redux-sagas/saga";
import RolesSagas from "../page/rol/redux-sagas/saga";
import GenericSagas from "../utils/redux-sagas/saga";

export default function* rootSaga(getState) {
  yield all([
    RolesSagas(),
    EmployeeSagas(),
    ClientSuppliersSagas(),
    ChecklistSagas(),
    CheckListProcessSagas(),
    CheckListProcessingSagas(),
    GenericSagas(),
    ChecklistInitProcessSagas(),
  ]);
}
