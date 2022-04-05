const { user, bookmark, shop, shop_pic } = require("../../models");
const jwt = require("jsonwebtoken");
const axios = require("axios");

module.exports = async (req, res) => {
  console.log("oauth login!!!!!!!!!!!!!!");
  const code = req.body.code;

  if (req.body.oauth === "KaKao") {
    axios //카카오
      .get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${code}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(async (result) => {
        const id = result.data.id;
        const nickname = result.data.properties.nickname;
        const email = result.data.kakao_account.email;

        const oauthuser = await user.findOne({
          where: {
            user_id: id,
          },
        });

        if (oauthuser) {
          console.log("가입된 유저");

          const userInfo = await user.findOne({
            where: {
              user_id: id,
            },
          });

          let payload = {
            user_id: userInfo.dataValues.user_id,
            email: userInfo.dataValues.email,
          };

          const access_Token = jwt.sign(payload, "1234", { expiresIn: "10h" });
          const refresh_Token = jwt.sign(payload, "5678", {
            expiresIn: "2days",
          });

          console.log(payload);

          console.log(access_Token);
          // 즐겨찾기 (쿠키에 담아 전송) 정보 가져오기-------------
          const bookmarkInfo = await bookmark.findAll({
            where: {
              user_id: userInfo.dataValues.user_id,
            },
          });

          const cookie = [];
          for (let i = 0; i < bookmarkInfo.length; i++) {
            const shopInfo = await shop.findOne({
              where: {
                id: bookmarkInfo[i].dataValues.shop_id,
              },
            });

            const shopPicInfo = await shop_pic.findOne({
              where: {
                shop_id: shopInfo.id,
              },
            });

            const obj = {
              id: shopInfo.id,
              shop_name: shopInfo.shop_name,
              genus: shopInfo.genus,
              location: shopInfo.location,
              pic_URL: shopPicInfo.pic_URL,
            };

            cookie.push(obj);
          }
          console.log(cookie);
          res.cookie("bookmark", JSON.stringify(cookie));
          // --------------------------------------------즐겨찾기
          res
            .status(200)
            .cookie("refreshToken", refresh_Token, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
            })
            .json({
              message: "Login success!",
              data: {
                accessToken: access_Token,
                nickname: userInfo.dataValues.nickname,
              },
            });
        } else {
          console.log("신규 가입 유저");
          user.create({
            user_id: id,
            nickname: nickname,
            email: email,
          });

          const userInfo = await user.findOne({
            where: {
              user_id: id,
            },
          });

          let payload = {
            user_id: userInfo.dataValues.user_id,
            email: userInfo.dataValues.email,
          };

          const access_Token = jwt.sign(payload, "1234", { expiresIn: "10h" });
          const refresh_Token = jwt.sign(payload, "5678", {
            expiresIn: "2days",
          });

          console.log(payload);

          console.log(access_Token);
          // 즐겨찾기 (쿠키에 담아 전송) 정보 가져오기-------------
          const bookmarkInfo = await bookmark.findAll({
            where: {
              user_id: userInfo.dataValues.user_id,
            },
          });

          const cookie = [];
          for (let i = 0; i < bookmarkInfo.length; i++) {
            const shopInfo = await shop.findOne({
              where: {
                id: bookmarkInfo[i].dataValues.shop_id,
              },
            });

            const shopPicInfo = await shop_pic.findOne({
              where: {
                shop_id: shopInfo.id,
              },
            });

            const obj = {
              id: shopInfo.id,
              shop_name: shopInfo.shop_name,
              genus: shopInfo.genus,
              location: shopInfo.location,
              pic_URL: shopPicInfo.pic_URL,
            };

            cookie.push(obj);
          }
          console.log(cookie);
          res.cookie("bookmark", JSON.stringify(cookie));
          // --------------------------------------------즐겨찾기
          res
            .status(200)
            .cookie("refreshToken", refresh_Token, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
            })
            .json({
              message: "Login success!",
              data: {
                accessToken: access_Token,
                nickname: userInfo.dataValues.nickname,
              },
            });
        }
      });
  } else {
    axios //깃허브
      .post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: "3e13dcd314570e792c58",
          client_secret: "5c84df451bd83eff205c8b10c85a69206cbaabab",
          code: code,
        },
        {
          headers: {
            accept: "application/json",
          },
        }
      )
      .then((result) => {
        console.log(result.data.access_token);

        axios
          .get("https://api.github.com/user", {
            headers: {
              Authorization: `Token ${result.data.access_token}`,
            },
          })
          .then(async (result) => {
            console.log("무언가 여기로 옴");
            console.log(result.data);
            console.log("끝");

            const id = result.data.id;
            const nickname = result.data.name;
            const email = result.data.url;
            console.log(id, nickname, email);

            const oauthuser = await user.findOne({
              where: {
                user_id: id,
              },
            });

            if (oauthuser) {
              console.log("가입된 유저");
              const userInfo = await user.findOne({
                where: {
                  user_id: id,
                },
              });

              let payload = {
                user_id: userInfo.dataValues.user_id,
                email: userInfo.dataValues.email,
              };

              const access_Token = jwt.sign(payload, "1234", {
                expiresIn: "10h",
              });
              const refresh_Token = jwt.sign(payload, "5678", {
                expiresIn: "2days",
              });

              console.log(payload);

              console.log(access_Token);
              console.log("res 발송");
              // 즐겨찾기 (쿠키에 담아 전송) 정보 가져오기-------------
              const bookmarkInfo = await bookmark.findAll({
                where: {
                  user_id: userInfo.dataValues.user_id,
                },
              });

              const cookie = [];
              for (let i = 0; i < bookmarkInfo.length; i++) {
                const shopInfo = await shop.findOne({
                  where: {
                    id: bookmarkInfo[i].dataValues.shop_id,
                  },
                });

                const shopPicInfo = await shop_pic.findOne({
                  where: {
                    shop_id: shopInfo.id,
                  },
                });

                const obj = {
                  id: shopInfo.id,
                  shop_name: shopInfo.shop_name,
                  genus: shopInfo.genus,
                  location: shopInfo.location,
                  pic_URL: shopPicInfo.pic_URL,
                };

                cookie.push(obj);
              }
              console.log(cookie);
              res.cookie("bookmark", JSON.stringify(cookie));
              // --------------------------------------------즐겨찾기
              res
                .status(200)
                .cookie("refreshToken", refresh_Token, {
                  httpOnly: true,
                  secure: true,
                  sameSite: "none",
                })
                .json({
                  message: "Login success!",
                  data: {
                    accessToken: access_Token,
                    nickname: userInfo.dataValues.nickname,
                  },
                });
            } else {
              console.log("가입안된 유저");

              user.create({
                user_id: id,
                nickname: nickname,
                email: email,
              });

              const userInfo = await user.findOne({
                where: {
                  user_id: id,
                },
              });

              let payload = {
                user_id: userInfo.dataValues.user_id,
                email: userInfo.dataValues.email,
              };

              const access_Token = jwt.sign(payload, "1234", {
                expiresIn: "10h",
              });
              const refresh_Token = jwt.sign(payload, "5678", {
                expiresIn: "2days",
              });

              console.log(payload);

              console.log(access_Token);
              // 쿠키 (즐겨찾기 정보를 담는 공간) 추가-------------
              const bookmarkInfo = await bookmark.findAll({
                where: {
                  user_id: userInfo.dataValues.user_id,
                },
              });

              const cookie = [];
              for (let i = 0; i < bookmarkInfo.length; i++) {
                const shopInfo = await shop.findOne({
                  where: {
                    id: bookmarkInfo[i].dataValues.shop_id,
                  },
                });

                const shopPicInfo = await shop_pic.findOne({
                  where: {
                    shop_id: shopInfo.id,
                  },
                });

                const obj = {
                  id: shopInfo.id,
                  shop_name: shopInfo.shop_name,
                  genus: shopInfo.genus,
                  location: shopInfo.location,
                  pic_URL: shopPicInfo.pic_URL,
                };

                cookie.push(obj);
              }

              // --------------------------------------------즐겨찾기
              res
                .status(200)
                .cookie("bookmark", JSON.stringify(cookie))
                .cookie("refreshToken", refresh_Token, {
                  httpOnly: true,
                  secure: true,
                  sameSite: "none",
                })
                .json({
                  message: "Login success!",
                  data: {
                    accessToken: access_Token,
                    nickname: userInfo.dataValues.nickname,
                  },
                });
            }
          })
          .then(console.log("인증절차 통과"))
          .catch((e) => console.log(e));
      });
  }
};
