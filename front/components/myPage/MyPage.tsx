import { BUTTON_COLOR as BORDER_COLOR } from "@utils/constant";
import {
  ContentClip,
  ContentContainer,
  InnerContainer,
  MedicineBadgeContainer,
  PharmarcyContainer,
  Profile,
  SocialLoginState,
  UserInfo,
  UserInfoContainer,
  UserInfoItem,
  UserInfoItemCount,
  UserName,
  UserNameWrapper,
  UserState,
  UserStateWrapper,
} from "./MyPage.style";
import Container from "common/container/Container";
import Capture from "common/capture/Capture";
import { useState } from "react";
import Medicine from "./medicine/Medicine";
import { MedicineBadge } from "./medicine/Medicine.style";
import Pharmarcy from "./pharmarcy/Pharmarcy";

const medicinesName: { [key in string]: string } = {
  name1: "가스모틴정",
  name2: "가스모틴정_2",
  name3: "가스모틴정_3",
  name4: "가스모틴정_4",
};

function MyPage() {
  return (
    <Container>
      <InnerContainer>
        <UserInfoContainer>
          <Profile>
            <Capture />
          </Profile>
          <UserInfo>
            <UserNameWrapper>
              <UserName $borderColor={BORDER_COLOR}>테스트 계정 님!</UserName>
              <SocialLoginState>카카오로그인</SocialLoginState>
            </UserNameWrapper>
            <UserStateWrapper>
              <UserState>
                <UserInfoItemCount>5</UserInfoItemCount>
                <UserInfoItem>복용약</UserInfoItem>
              </UserState>
              <UserState>
                <UserInfoItemCount>5</UserInfoItemCount>
                <UserInfoItem>복용약</UserInfoItem>
              </UserState>
              <UserState>
                <UserInfoItemCount>5</UserInfoItemCount>
                <UserInfoItem>복용약</UserInfoItem>
              </UserState>
            </UserStateWrapper>
          </UserInfo>
        </UserInfoContainer>
        <ContentContainer $borderColor={BORDER_COLOR}>
          <ContentClip $bgColor={BORDER_COLOR}>복용약</ContentClip>
          <MedicineBadgeContainer>
            {Object.entries(medicinesName).map(([key, value], index) => (
              <Medicine key={key} name={value} />
            ))}
          </MedicineBadgeContainer>
        </ContentContainer>
        <ContentContainer $borderColor={BORDER_COLOR}>
          <ContentClip $bgColor={BORDER_COLOR}>관심 약국</ContentClip>
          <PharmarcyContainer>
            <Pharmarcy></Pharmarcy>
            <Pharmarcy></Pharmarcy>
          </PharmarcyContainer>
        </ContentContainer>
      </InnerContainer>
    </Container>
  );
}

export default MyPage;
