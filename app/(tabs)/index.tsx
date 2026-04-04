import * as React from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import Header from "../components/Header";
import LessonPath from "../components/LessonPath";
import Vector3 from "../assets/Vector-3.svg";
import Ellipse21 from "../assets/Ellipse-21.svg";
import FrameComponent11111 from "../components/FrameComponent11111";
import FrameComponent111111 from "../components/FrameComponent111111";
import FrameComponent1111111 from "../components/FrameComponent1111111";
import FrameComponent11111111 from "../components/FrameComponent11111111";
import Vector4 from "../assets/Vector-4.svg";
import Subtract1 from "../assets/Subtract1.svg";
import LessonTitle from "../components/LessonTitle";
import Vector1 from "../assets/Vector1.svg";
import { Color, Width, Gap, Height, Border } from "../GlobalStyles";

const Home = () => {
  return (
    <ScrollView
      style={styles.home}
      contentContainerStyle={styles.homeScrollViewContent}
    >
      <Header />
      <View style={styles.homeInner}>
        <View style={[styles.lessonPathParent, styles.lessonLayout]}>
          <LessonPath
            property1="Vector 3"
            vector3={<Vector3 width={100} height={100} />}
          />
          <Pressable style={styles.frameParent} onPress={() => {}}>
            <View style={styles.ellipseParent}>
              <Ellipse21
                style={[styles.frameChild, styles.frameLayout]}
                width={Width.width_104_83}
                height={73}
              />
              <Image
                style={[styles.untitled11Icon, styles.iconPosition]}
                contentFit="cover"
                source={require("../assets/Untitled-1-1.png")}
              />
            </View>
            <FrameComponent11111 state="Compeleted" state1="Compeleted" />
          </Pressable>
        </View>
      </View>
      <View
        style={[
          styles.lessonPathsContainerWrapper,
          styles.lessonContainerLayout,
        ]}
      >
        <View
          style={[styles.lessonPathsContainer, styles.lessonContainerLayout]}
        >
          <FrameComponent111111 />
          <FrameComponent1111111 />
          <FrameComponent11111111 />
          <View style={[styles.lessonPathGroup, styles.lessonLayout]}>
            <LessonPath
              property1="Vector 4"
              lessonPathHeight={82}
              lessonPathWidth={160}
              lessonPathRight={-9}
              lessonPathBottom="unset"
              lessonPathTop={-43}
              lessonPathLeft="unset"
              vector3={<Vector4 width={100} height={100} />}
            />
            <Pressable style={styles.frameParent} onPress={() => {}}>
              <View style={styles.ellipseGroup}>
                <Ellipse21
                  style={[styles.frameItem, styles.frameLayout]}
                  width={Width.width_104_83}
                  height={73}
                />
                <Image
                  style={[styles.tubo21Icon, styles.iconPosition]}
                  contentFit="cover"
                  source={require("../assets/tubo2-1.png")}
                />
              </View>
              <View style={styles.subtractParent}>
                <Subtract1
                  style={styles.subtractIcon}
                  width={Width.width_131}
                  height={Height.height_61}
                />
                <LessonTitle
                  state="Locked"
                  lessonUnit="Bài 4"
                  lessonName="Ngày và thứ- 날짜ㅇ와 요일    "
                  showIcon
                  property1="Keyhole"
                  vector={<Vector1 width={81} height={81} />}
                  vectorIconHeight="81.11%"
                  vectorIconWidth="81.11%"
                  vectorIconTop="9.44%"
                  vectorIconRight="9.44%"
                  vectorIconLeft="9.44%"
                />
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  homeScrollViewContent: {
    flexDirection: "column",
    paddingBottom: 102,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 30,
    height: 1194,
    flex: 1,
  },
  lessonLayout: {
    width: 250,
    flexDirection: "row",
  },
  frameLayout: {
    color: Color.main,
    height: 73,
    left: 0,
    position: "absolute",
    width: Width.width_104_83,
  },
  iconPosition: {
    top: 0,
    position: "absolute",
    zIndex: 1,
  },
  lessonContainerLayout: {
    height: 554,
    zIndex: null,
  },
  home: {
    width: "100%",
    backgroundColor: Color.bg,
    flex: 1,
    maxWidth: "100%",
  },
  homeInner: {
    width: 279,
    paddingLeft: 29,
    flexDirection: "row",
    height: 128,
    zIndex: null,
  },
  lessonPathParent: {
    height: 128,
  },
  frameParent: {
    alignItems: "center",
    gap: Gap.gap_14,
    zIndex: 1,
    flexDirection: "row",
  },
  ellipseParent: {
    width: Width.width_104_83,
    height: 128,
  },
  frameChild: {
    top: 55,
  },
  untitled11Icon: {
    left: 9,
    width: 89,
    height: 110,
  },
  lessonPathsContainerWrapper: {
    width: 365,
    paddingLeft: 28,
    flexDirection: "row",
  },
  lessonPathsContainer: {
    width: 337,
    gap: 38,
  },
  lessonPathGroup: {
    height: Height.height_113,
  },
  ellipseGroup: {
    height: Height.height_113,
    width: Width.width_104_83,
  },
  frameItem: {
    top: 40,
  },
  tubo21Icon: {
    left: 13,
    width: 90,
    height: Height.height_100,
  },
  subtractParent: {
    justifyContent: "center",
    gap: Gap.gap_10,
  },
  subtractIcon: {
    width: Width.width_131,
    height: Height.height_61,
    borderRadius: Border.br_15,
    zIndex: 0,
  },
});

export default Home;
