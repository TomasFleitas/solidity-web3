import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import style from "./index.module.scss";
import { WithContext as ReactTags } from "react-tag-input";
import { memo, useCallback, useEffect, useState } from "react";
import { useContract } from "../../providers/contractProvider";
import { useNotification } from "../../hooks/useNotification";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

type props = { show: boolean; onClose: any };

const MAX_OPTIONS = 3;

const AddQuestion = ({ show, onClose }: props) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { contract, isOnwer, balance, coinName, coinSymbol } = useContract();
  const [CREATE_QUESTION_COST, setCreateQuestionCost] = useState<any>();
  const { openSuccessNotification, openErrorNotification } = useNotification();

  const handleDelete = (i: number) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag: any) => {
    if (tags.length === MAX_OPTIONS) {
      setErrorOptions([`Max. ${MAX_OPTIONS} opciones`]);
      return;
    }
    setTags([...tags, tag]);
  };

  const handleDrag = (tag: any, currPos: any, newPos: any) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
  };

  useEffect(() => {
    if (!contract) return;
    contract.CREATE_QUESTION_COST().then((v: any) => setCreateQuestionCost(v));
  }, [contract]);

  const addQuestion = useCallback(
    async v => {
      if (!isOnwer && balance < CREATE_QUESTION_COST) {
        openErrorNotification(`No tienes suficiente ${coinName} (${coinSymbol} ${CREATE_QUESTION_COST} requeridos)`);
        return;
      }
      if (tags.length === 0) {
        setErrorOptions(["Campo obligatorio"]);
        return;
      }

      const aux = { ...v, opts: tags.map(t => t.text) };

      try {
        setLoading(true);
        await contract.addQuestion(aux.text, aux.image || "", aux.lifetimeSeconds, aux.opts, aux.correctAns);
        openSuccessNotification("Pregunta agregada con éxito!");
        form.resetFields();
        setTags([]);
        setLoading(false);
        onClose();
      } catch (error: any) {
        setLoading(false);
        openErrorNotification(
          error.data.message.split("revert ")?.[1]?.match("Need more QUIZ_COIN")
            ? `No tienes suficiente ${coinName} (${coinSymbol} ${CREATE_QUESTION_COST} requeridos)`
            : "Error al agregar la pregunta"
        );
        console.log(error.data.message.split("revert ")[1]);
      }
    },
    [contract, tags, CREATE_QUESTION_COST, balance, isOnwer, coinSymbol, coinName]
  );

  useEffect(() => {
    if (!!tags.length) setErrorOptions([]);
  }, [tags]);

  const setErrorOptions = (errors: string[]) => {
    form.setFields([
      {
        name: "opts",
        errors: errors,
      },
    ]);
  };

  return (
    <Modal closable onCancel={onClose} footer={false} visible={show}>
      <div className={style.add_question}>
        <Form layout="vertical" form={form} onFinish={addQuestion}>
          <Row>
            <Col span={24}>
              <Form.Item label="Pregunta" name="text" rules={[{ required: true, message: "Campo obligatorio" }]}>
                <Input.TextArea
                  showCount
                  maxLength={200}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  required
                  placeholder="Pregunta"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item rules={[{ type: "url", message: "Url de imagen" }]} label="Url de Imagen" name="image">
                <Input type="url" placeholder="URL de Imagen" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label={
                  <div>
                    <span style={{ color: "#ff4d4f", fontSize: "14px", fontFamily: "SimSun, sans-serif" }}>* </span>
                    Opciones de respuesta
                  </div>
                }
                name="opts">
                <ReactTags
                  maxLength={100}
                  tags={tags}
                  delimiters={delimiters}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  handleDrag={handleDrag}
                  inputFieldPosition="bottom"
                  placeholder="Agreagr opciones"
                  autocomplete
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                label="Tiempo para responder (s)"
                name="lifetimeSeconds"
                rules={[{ required: true, message: "Campo obligatorio" }]}>
                <InputNumber placeholder="Tiempo para responder" step="1" min="1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Respuesta correcta"
                name="correctAns"
                rules={[{ required: true, message: "Campo obligatorio" }]}>
                <Select>
                  {tags.map(({ text }) => (
                    <Select.Option value={text}>{text}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Button loading={loading} className={style.save_button} type="primary" htmlType="submit">
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default memo(AddQuestion);
