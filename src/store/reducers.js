import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import LayoutReducer from "../components/layout/redux/reducer";
import RolesReducer from "../page/rol/redux-sagas/reducer";
import EmployeeReducer from "../page/employee/redux-sagas/reducer";
import ClientSupplierReducer from "../page/clientSupplier/redux-sagas/reducer";
import ChecklistReducer from "../page/checklist/redux-sagas/reducer";
import CheckListProcessReducer from "../page/checklistProcess/redux-sagas/reducer";
import GenericReducer from "../utils/redux-sagas/reducer";
import CheckListProcessingReducer from "../page/checklistProcessing/redux-sagas/reducer";
import ChecklistInitProcessReducer from "../page/checklistInitProcess/redux-sagas/reducer";

const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    layout: LayoutReducer,
    roles: RolesReducer,
    employee: EmployeeReducer,
    clientSupplier: ClientSupplierReducer,
    checklist: ChecklistReducer,
    checkListProcess: CheckListProcessReducer,
    checklistProcessing: CheckListProcessingReducer,
    generic: GenericReducer,
    checklistInitProcess: ChecklistInitProcessReducer,
  });

export default createRootReducer;
