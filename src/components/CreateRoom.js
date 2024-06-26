import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreateRoomForm,
  ButtonContainer,
  TextAreaContainer,
  StyledTextArea,
  StyledLabel,
  MarkdownPreview,
  CharacterCount,
} from "../css/CreateRoomCss";
import Button from "./Button";
import renderMarkdown from "../utils/renderMarkdown";
import RoomTitle from "./RoomTitle";
import WriteAndPreviewInputButton from "./WriteAndPreviewInputButton";

import { axiosInstance } from "../utils/apiConfig";

export default function CreateRoom() {
  const [title, setTitle] = useState("");
  const [codeAndContents, setCodeAndContents] = useState("");
  const [isInput, setIsInput] = useState(true);
  const [textareaHeight, setTextareaHeight] = useState("auto");

  useEffect(() => {
    if (isInput) {
      const event = {
        target: document.querySelector('textarea[name="contents"]'),
      };
      autoResizeTextarea(event);
    }
  }, [isInput]);

  const autoResizeTextarea = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    const newHeight = `${textarea.scrollHeight}px`;
    textarea.style.height = newHeight;
    setTextareaHeight(newHeight);
  };

  let navigate = useNavigate();

  function handleMainPage() {
    navigate("/");
  }

  const handleSave = async (e) => {
    e.preventDefault();

    if (title.length > 50) {
      alert("제목은 50자 이내로 입력해주세요.");
      return;
    }
    if (codeAndContents.length > 3000) {
      alert("내용은 3000자 이내로 입력해주세요.");
      return;
    }

    const roomData = {
      title: title,
      codeAndContents: codeAndContents,
    };

    try {
      await axiosInstance.post(`/room/`, roomData);

      alert("방이 성공적으로 생성되었습니다!");
      handleMainPage();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("제목 또는 내용을 입력하셔야합니다.");
      } else {
        alert("방 생성에 실패했습니다.");
      }
    }
  };

  const markdownContent = renderMarkdown(codeAndContents);

  return (
    <>
      <CreateRoomForm>
        <div>
          <RoomTitle title={title} setTitle={setTitle} />
          <CharacterCount>({title.length}/50)</CharacterCount>
        </div>

        {isInput ? (
          <div>
            <StyledLabel htmlFor="codeAndContents">
              코드 & 내용 (Markdown을 지원합니다.)
            </StyledLabel>
            <WriteAndPreviewInputButton
              onInput={() => setIsInput(true)}
              onPreview={() => setIsInput(false)}
              isInput={isInput}
            />
            <TextAreaContainer>
              <StyledTextArea
                id="codeAndContents"
                type="text"
                name="contents"
                placeholder="코드 & 내용을 입력하세요. (Markdown을 지원합니다.)"
                value={codeAndContents}
                style={{ height: textareaHeight }}
                onChange={(e) => {
                  setCodeAndContents(e.target.value);
                  autoResizeTextarea(e);
                }}
                maxLength={3000}
              />
              <CharacterCount>({codeAndContents.length}/3000)</CharacterCount>
            </TextAreaContainer>
          </div>
        ) : (
          <div>
            <StyledLabel>미리보기</StyledLabel>
            <WriteAndPreviewInputButton
              onInput={() => setIsInput(true)}
              onPreview={() => setIsInput(false)}
              isInput={isInput}
            />
            <TextAreaContainer>
              <MarkdownPreview>{markdownContent}</MarkdownPreview>
            </TextAreaContainer>
          </div>
        )}

        <ButtonContainer>
          <Button $variant="cancel" type="button" onClick={handleMainPage}>
            취소
          </Button>
          <Button $variant="save" type="submit" onClick={handleSave}>
            저장
          </Button>
        </ButtonContainer>
      </CreateRoomForm>
    </>
  );
}
