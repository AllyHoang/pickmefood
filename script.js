const { MongoClient } = require("mongodb");

// Connection URL for MongoDB (Adjust it according to your setup)
const url =
  "mongodb+srv://vtmpteam2:B8u4QaH2cmMhdXHx@cluster0.d8arnzx.mongodb.net/";

// Database name
const dbName = "pickmefood";

// Data to insert
const data = {
  places: [
    {
      formattedAddress: "1200 Spring St, Bethlehem, PA 18018, USA",
      displayName: {
        text: "Holy Family Senior Living",
        languageCode: "en",
      },
      photos: [
        {
          name: "places/ChIJuzvoS-U-xIkR023Iv4mReNE/photos/AUc7tXXvSB-5q9RMHs-74k7qN-B7juZVVZqgjPeeElck5ozr1EMwBVE4ybQPAb9Ndi1Hy2qQpfTrlh9Ia_7DPYXWOe-fZ4n3-z8FRgoO5N3BHRRsjmiKvA9lgQLzCpOYmppKenE01WF3mulB9g1ZkdoocyXWvhA-CEJCPy2L",
          widthPx: 4928,
          heightPx: 3264,
          authorAttributions: [
            {
              displayName: "Holy Family Senior Living",
              uri: "//maps.google.com/maps/contrib/102278607524767679421",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWRWv-b_G2NFQ-oe5W1Ibll5py-pY_KLu06_y1VWZAX-RtqScLI=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJuzvoS-U-xIkR023Iv4mReNE/photos/AUc7tXXcUFyDeTDmuHhPG_dBnj9_iisCUpIr6DJDUM7syF78ypgUP4X2ZZaeI0ao3O6CSN_447hsny_L17kCc69Vb_N2WbEq0yXIYsZHhm8VpT8YomTinDNIWIPMU-uutgFS5pbijIW_ipt2QqW9o1EXwfNkG5W7CAlcd1Uq",
          widthPx: 2000,
          heightPx: 1825,
          authorAttributions: [
            {
              displayName: "Holy Family Senior Living",
              uri: "//maps.google.com/maps/contrib/102278607524767679421",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWRWv-b_G2NFQ-oe5W1Ibll5py-pY_KLu06_y1VWZAX-RtqScLI=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJuzvoS-U-xIkR023Iv4mReNE/photos/AUc7tXVr8PFjC_hiNgtXPhOP4SIXSX884xZ3Xpat_49QlAlztIMtccresV396DxOCdBhdFhIlfYOmB0QYabl-lInPTe2-W8vu9JYncDjlw87dP3yiZG7fjQbxYflbRMLlGGoPbawSSz-gR8iLGUC9WsEDFmtLXgb9UQ7ZpsU",
          widthPx: 2048,
          heightPx: 1536,
          authorAttributions: [
            {
              displayName: "Holy Family Senior Living",
              uri: "//maps.google.com/maps/contrib/102278607524767679421",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWRWv-b_G2NFQ-oe5W1Ibll5py-pY_KLu06_y1VWZAX-RtqScLI=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJuzvoS-U-xIkR023Iv4mReNE/photos/AUc7tXUJZeBbaiHpzSMZ9a35YmXJAXBszR0eo5SQuXmCAQG3EiYJ9Bj9H86aL6lOSe2XWBl5kdS3-l8tBADwQeWbK-oTxU1Fz7kucv97oEbnVax2gRJYWn1Vlgh2GxKlGX7Jr43lXTquI0DtDY3L70fHhsx3ArZ3LNA9Yu_4",
          widthPx: 2048,
          heightPx: 1536,
          authorAttributions: [
            {
              displayName: "Holy Family Senior Living",
              uri: "//maps.google.com/maps/contrib/102278607524767679421",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWRWv-b_G2NFQ-oe5W1Ibll5py-pY_KLu06_y1VWZAX-RtqScLI=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJuzvoS-U-xIkR023Iv4mReNE/photos/AUc7tXWkarZEKXoio3_Yo7PcSvopM1YLS1ivzUvHQ2ocXDZaUownx24Vxbmj16-ilwhCeZeIADEOdpyYPIxVM6S8-Sc93D11-fWLFTDEFfJ9DAwMK-aGgnuUkvArQ1a5C6_R-PXK6O7SrdtuSwrsCKkhfQQNzl3EXnwyv8HF",
          widthPx: 2048,
          heightPx: 1536,
          authorAttributions: [
            {
              displayName: "Holy Family Senior Living",
              uri: "//maps.google.com/maps/contrib/102278607524767679421",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWRWv-b_G2NFQ-oe5W1Ibll5py-pY_KLu06_y1VWZAX-RtqScLI=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJuzvoS-U-xIkR023Iv4mReNE/photos/AUc7tXWGr168N1oEijaIju0D1lz6Py_dJvMMZXL8X-XmvCFPb4xds5YCKQhLl12O4mkEdNGo75nmdVCHac3ZdtRpsQ0LLY71mPcQ3wnYdYr7rNF5-MX_Dg8Omn5fVGF0f4HM1PQYFiZ6_m_edO5O2ov4BEbBC6ZE5eCN8iUJ",
          widthPx: 2048,
          heightPx: 1536,
          authorAttributions: [
            {
              displayName: "Holy Family Senior Living",
              uri: "//maps.google.com/maps/contrib/102278607524767679421",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWRWv-b_G2NFQ-oe5W1Ibll5py-pY_KLu06_y1VWZAX-RtqScLI=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJuzvoS-U-xIkR023Iv4mReNE/photos/AUc7tXV1F_zxwrzEB109K_iKis_h6SAWOsbxGRRkhdc01IbHCNRdGk_h_6E_jGya_l35PdHBIVHs5wU-myN5FOOHTfe90eT8vsPH1vE5mwDb2vUyUKTXziynG6nQ5NPu5gvivYn5fWFNpkS0LUly_hIlBfesJosYeXMYvIYR",
          widthPx: 1200,
          heightPx: 1200,
          authorAttributions: [
            {
              displayName: "Holy Family Senior Living",
              uri: "//maps.google.com/maps/contrib/102278607524767679421",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWRWv-b_G2NFQ-oe5W1Ibll5py-pY_KLu06_y1VWZAX-RtqScLI=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJuzvoS-U-xIkR023Iv4mReNE/photos/AUc7tXVpUz9f3GSFW7DMcub2httcGhPTBGLnIwSmQar1jDFjKcF-XgcFxGfOu47Kt5O38NZ3KtGUTVT-Rshm_tBGjy9TAC7ZF_N3EDfi4xzCkwLpgUUp4WqFBYE2WIM-yCpKmAGDPMitrWV071sA3AswfdhUd411zFB431E_",
          widthPx: 2048,
          heightPx: 1536,
          authorAttributions: [
            {
              displayName: "Holy Family Senior Living",
              uri: "//maps.google.com/maps/contrib/102278607524767679421",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWRWv-b_G2NFQ-oe5W1Ibll5py-pY_KLu06_y1VWZAX-RtqScLI=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJuzvoS-U-xIkR023Iv4mReNE/photos/AUc7tXV_o4kziQbyhiI0yxHzRx6aY4b7FVK0sH-E1_XBb9kKl-r0jPVqAuL9J9zbdi2vWYWcDZ_NYTbqtnDg5gt5VOvOLFr60WfphXJL6pqVYx9f6KGtuKozrmtfvu7KGt4xRCFMrMyPZFrpV1SQBm9DvI3rqk6L-XB8xy96",
          widthPx: 1781,
          heightPx: 2048,
          authorAttributions: [
            {
              displayName: "Holy Family Senior Living",
              uri: "//maps.google.com/maps/contrib/102278607524767679421",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWRWv-b_G2NFQ-oe5W1Ibll5py-pY_KLu06_y1VWZAX-RtqScLI=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJuzvoS-U-xIkR023Iv4mReNE/photos/AUc7tXXiUSW6Af8Qa6YLLcMmFmpr00FtmD3RzZzajRkK-D01vLuO04-bXvYIz3s6EPl8UxBKilpdE9vvs2TSq0XrUfrxIH8lUkva-2wlRcP43Rol7-DdpfsCj8ne_25Q4gyEAhX4FvXpiozGf4_RLXJE_WWX5-IV8uL0cz2d",
          widthPx: 1200,
          heightPx: 1200,
          authorAttributions: [
            {
              displayName: "Holy Family Senior Living",
              uri: "//maps.google.com/maps/contrib/102278607524767679421",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWRWv-b_G2NFQ-oe5W1Ibll5py-pY_KLu06_y1VWZAX-RtqScLI=s100-p-k-no-mo",
            },
          ],
        },
      ],
    },
    {
      formattedAddress: "2855 Schoenersville Rd, Bethlehem, PA 18017, USA",
      displayName: {
        text: "Good Shepherd Home - Bethlehem",
        languageCode: "en",
      },
      photos: [
        {
          name: "places/ChIJ7Ukx8yI_xIkRFbpCUkaxQXw/photos/AUc7tXWKdo6t-xWgncZUeszIXnSr4xLtElgYeq-zJR9NGjRjXJOlkTlnmFZBAumHVugd5YGyqSj7tv71H0Nls9et9FW212p8pBoqZUE7LXEe2nGTKjQqR4CYSdSCmROKBO70aXD0W0GEZe2Dn1brSzcYSsG6EKznisfVjdm4",
          widthPx: 8334,
          heightPx: 3263,
          authorAttributions: [
            {
              displayName: "Good Shepherd Home - Bethlehem",
              uri: "//maps.google.com/maps/contrib/100411351644443378180",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjURvLasmDcNlShXoDi7pOCSMeaNQUBAXQTwt-zC4pol2EwwRK9V=s100-p-k-no-mo",
            },
          ],
        },
      ],
    },
    {
      formattedAddress: "61 W Market St, Bethlehem, PA 18018, USA",
      displayName: {
        text: "Moravian King's Daughters Home",
        languageCode: "en",
      },
      photos: [
        {
          name: "places/ChIJAa4-I1E-xIkRYQCuD4Z65sQ/photos/AUc7tXUqfNsYEi137W5Iyp5ZwqrB43jKX1J0FwDMwVqyA6iUNRgqeuBJwI2c_sz8yRsdeujIBqxUOJPZPaC-IqehqSgpHYaW1ykSZ71hswiuV4w5sduxmcARceJjmkuIJvbAP8hwsI8ilIgdQX7I3BcSrDpqef_srg3x7OCa",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "John Marquette",
              uri: "//maps.google.com/maps/contrib/112019249660464370847",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUR6w0oWiva_nHp2GDo7DQ0Korw8L4_gR1aHdmcvq4dni3unU-feg=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJAa4-I1E-xIkRYQCuD4Z65sQ/photos/AUc7tXXqZetKtU3xFx4LE3nhCxr9DLnBATlvBY7y3qec3KfrGKrGVlI5HKXUBJBtUQDccbQ4v-F1cYrxCLvqn8rUot7fSoblvzqueZi_UfuwjBl8YXXMBpDsTyDQU9kXm5SbkX1253mpKwFFntP0sBa3pr0cFD8915shw3lz",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "John Marquette",
              uri: "//maps.google.com/maps/contrib/112019249660464370847",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUR6w0oWiva_nHp2GDo7DQ0Korw8L4_gR1aHdmcvq4dni3unU-feg=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJAa4-I1E-xIkRYQCuD4Z65sQ/photos/AUc7tXXuN7AA9nbrKilQD8M80-S6EwSLikzBbl3g1bMet5vNHnNYq3GyHxZ_1hr93o4GaJciIxOlAtph_4c12VpRBfXc4Xtd48cv7_n4dFl64T2JdzPfDuLaLjpEeHpQFzGpvER78JvH6mdBmcvCrMvqNmI0k5gR7zCZCwvb",
          widthPx: 2898,
          heightPx: 2174,
          authorAttributions: [
            {
              displayName: "John Marquette",
              uri: "//maps.google.com/maps/contrib/112019249660464370847",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUR6w0oWiva_nHp2GDo7DQ0Korw8L4_gR1aHdmcvq4dni3unU-feg=s100-p-k-no-mo",
            },
          ],
        },
      ],
    },
    {
      formattedAddress: "526 Wood St, Bethlehem, PA 18018, USA",
      displayName: {
        text: "Moravian Village of Bethlehem",
        languageCode: "en",
      },
      photos: [
        {
          name: "places/ChIJX84ntDU-xIkRgdZa7QMvX1s/photos/AUc7tXWDxJG-e4yr5q-TxJ0BGWaKf7cppj7wmT4T7MCrqgtujrDclDlfnXWi9fJoJoHs1r0FPTHm4Q37QfQBHtICd4uR5EZX5Gds-jrKi_IyM8e28cIMZTuEu8Tifrgfp8sFLwmuZaLufi76yKOvJFRgS9-BV0qVn-tUiVEs",
          widthPx: 400,
          heightPx: 500,
          authorAttributions: [
            {
              displayName: "Moravian Village of Bethlehem",
              uri: "//maps.google.com/maps/contrib/115247544717601509192",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXrqsvzcphiZ2_v48xDSvCMn6k9M8EyngNDxjbuqn3ChLrHlRc=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJX84ntDU-xIkRgdZa7QMvX1s/photos/AUc7tXWtLveo3IAko4GMlp5h9G8BqY24JCM0XpTDttg99MH3k93wD-HI4o77ayv5aV4xcK3JMRyDqOgslIdQmaD95WZamM7z3lBV95HwJ3fnjMhFIC_g2fnNVcDgkwzLTykCm2vcMBiRhKY2MhMcsvNSLSZV7FvRKQJSfyiX",
          widthPx: 400,
          heightPx: 400,
          authorAttributions: [
            {
              displayName: "Moravian Village of Bethlehem",
              uri: "//maps.google.com/maps/contrib/115247544717601509192",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXrqsvzcphiZ2_v48xDSvCMn6k9M8EyngNDxjbuqn3ChLrHlRc=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJX84ntDU-xIkRgdZa7QMvX1s/photos/AUc7tXUwoJX7O5XaxRw9kgZ1i94JnII6sQBfG76Kn73gg_hSxnFKHjJVTUxkDmutcqydcDcLTh5gV8y_nbBY2GoKjIALJZo8R3qAhJKMy3jLg8aqNiay7YMgpFy6xNgE4akxX4BuxO_HaWKbBylE_mg7yPk25nW1n27MCt0v",
          widthPx: 400,
          heightPx: 400,
          authorAttributions: [
            {
              displayName: "Moravian Village of Bethlehem",
              uri: "//maps.google.com/maps/contrib/115247544717601509192",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXrqsvzcphiZ2_v48xDSvCMn6k9M8EyngNDxjbuqn3ChLrHlRc=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJX84ntDU-xIkRgdZa7QMvX1s/photos/AUc7tXWntauQ9zkJwuII1YgZkDRwJv2pU746IS-EHaDC6p8tmaXZl0L-AyF_oUMjulvlwpyQS97hIHwRUklQ94SIWoylWvwoa9ohmvXZ1xHR9A3ruW0aQjyFRRVaSzKgMe4DQK3FkGGyXCR9dtt_c50JHdaFRS08l3Cg7gY_",
          widthPx: 400,
          heightPx: 500,
          authorAttributions: [
            {
              displayName: "Moravian Village of Bethlehem",
              uri: "//maps.google.com/maps/contrib/115247544717601509192",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXrqsvzcphiZ2_v48xDSvCMn6k9M8EyngNDxjbuqn3ChLrHlRc=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJX84ntDU-xIkRgdZa7QMvX1s/photos/AUc7tXVR2coeMqJEDmMXy_xquYqMWU_2H_3Ad2elnc-ovKwiZMF96ioX-o82q7niSTwSsVvvJcEgf8fs-p2EUAO4xPsjWAeu0Ex0a1TYyy9uloopGqY9MiBM4lqN2MgcGIJd2pidFciIDfpgtfIXIMEjgLYmsflBrlT8zVXx",
          widthPx: 400,
          heightPx: 400,
          authorAttributions: [
            {
              displayName: "Moravian Village of Bethlehem",
              uri: "//maps.google.com/maps/contrib/115247544717601509192",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXrqsvzcphiZ2_v48xDSvCMn6k9M8EyngNDxjbuqn3ChLrHlRc=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJX84ntDU-xIkRgdZa7QMvX1s/photos/AUc7tXURNA2vMctOvG0KunJHD1Ot33rvCurVa8_3axPnO9C5CZla8ncTY_6sDQdaO5_MyfP75uPI44443d763et_8ammYH5MFuzoe9MGxXr7rQgpnDVa-4rGgv0lhTrvCvmujdyAiEq3Yd5vmpnyh_rtmrqCILuJLpRSD7y-",
          widthPx: 400,
          heightPx: 500,
          authorAttributions: [
            {
              displayName: "Moravian Village of Bethlehem",
              uri: "//maps.google.com/maps/contrib/115247544717601509192",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXrqsvzcphiZ2_v48xDSvCMn6k9M8EyngNDxjbuqn3ChLrHlRc=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJX84ntDU-xIkRgdZa7QMvX1s/photos/AUc7tXXh6fTsZrv7zLVKs9rrVBJLx1Btbj62YZlyWTEDHNTBUv-vRXHivdCdB--zvBk9aNija-g6EX2Do_M0yep4Au5f5yUXMNxuE2nZ9zSb6jid7WYhebVUcskiwhIYKvKo6QfV-1atERwgyaRZ2oHIYYUdrDEPC4cAn58",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Patrick Burke",
              uri: "//maps.google.com/maps/contrib/114695818042927789827",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVYWCVL46Zea0iv1ozPr1VOoewc57r5ci7wRgPq6d3MKFBuTdU=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJX84ntDU-xIkRgdZa7QMvX1s/photos/AUc7tXVQcPUdZwM8EYMxZdpDWsOmYRRt1kqqdWTpFp03gYVsWuRi30Kg56lpeL4S09owfnLmfTIiZvtD_6itWzeoStvoqiLnBD6uisLVJhYc-3HZ4kdX5ryIDm7qs6MQZBaodzW6PkoMGsIelkm8aOIdT3QWcdPC8tGavbw",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Patrick Burke",
              uri: "//maps.google.com/maps/contrib/114695818042927789827",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVYWCVL46Zea0iv1ozPr1VOoewc57r5ci7wRgPq6d3MKFBuTdU=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJX84ntDU-xIkRgdZa7QMvX1s/photos/AUc7tXVf4gnuX8KjZxobeLsOOXTphYxiwNTczUV7RIYckEnSBXDpw8jpfK2H-3ePWyUGROrV8TbOFyz097-gZbXTHk5lQMLWVO80-z7TapgMQoyu4i2AuKrUeSJxCm98PYsEr9vKJMAsincmzZwrTBBwXXtt-cC-cFMzWVm-",
          widthPx: 4160,
          heightPx: 2080,
          authorAttributions: [
            {
              displayName: "David Bracero",
              uri: "//maps.google.com/maps/contrib/117369035938512133427",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXAu5VNomUQu_wB5GfVuklGiffeTUL8COlf8l1wZHbPovLcQTy_bA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJX84ntDU-xIkRgdZa7QMvX1s/photos/AUc7tXUpqsPfKN96LFaxAf2bsJcEC7iQ5JGyxKwt7Xit2Thq5KOrhVoD5O0-QzvdtrOJ_qEyvllrTg3o98G5RCaq56MiyzhNXc63qX_P10swJh8ibZx5TLTu1DWLBF6jSSg1NIjeO0UQfHK4tX2X7t41j-uXtQZlLr_4ytiU",
          widthPx: 4160,
          heightPx: 2080,
          authorAttributions: [
            {
              displayName: "David Bracero",
              uri: "//maps.google.com/maps/contrib/117369035938512133427",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXAu5VNomUQu_wB5GfVuklGiffeTUL8COlf8l1wZHbPovLcQTy_bA=s100-p-k-no-mo",
            },
          ],
        },
      ],
    },
    {
      formattedAddress: "2029 Westgate Dr, Bethlehem, PA 18017, USA",
      displayName: {
        text: "Bethlehem North Skilled Nursing and Rehabilitation Center",
        languageCode: "en",
      },
      photos: [
        {
          name: "places/ChIJlzo_Kxg_xIkRsgHFhZGApQU/photos/AUc7tXUB_vKU0Jy4qqgHjhfCUCnqwT_JPVZ87ZKb7mUoE5w1-jjcuGuYqRw0JejAeOL_ebhxU2cJGKJPRPZatPmc30o21Q_SSQl-B2g-d_7lKuudRo9GT1rUKOcny60EVCql3SiLDDxJaUdFrTEFOuxKWrBoh3EQfeZRw1_8",
          widthPx: 1500,
          heightPx: 994,
          authorAttributions: [
            {
              displayName: "Gruen Agency HCR - ManorCare",
              uri: "//maps.google.com/maps/contrib/112648436131462249884",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUQgVX4-ME2RI7Y7SIdEhmRVjqciv2I49M55qS-aN2qCrUm4xhY=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJlzo_Kxg_xIkRsgHFhZGApQU/photos/AUc7tXWywdVsJxKMd1JvoUSLAz8ktW_rnaLfDh7_PIdeXHWff3Fl3oFx3clkeRS3j18oZxTFdMC8Bj_aeL8Xujyhhnc9Z_76DMbPXJdxbyOP2Ei1FwDGYqcygxqIalP3ShXuGd8yunSbeLcy38CHIUiSDhh02fgLr-ruMT90",
          widthPx: 1500,
          heightPx: 994,
          authorAttributions: [
            {
              displayName: "Gruen Agency HCR - ManorCare",
              uri: "//maps.google.com/maps/contrib/112648436131462249884",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUQgVX4-ME2RI7Y7SIdEhmRVjqciv2I49M55qS-aN2qCrUm4xhY=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJlzo_Kxg_xIkRsgHFhZGApQU/photos/AUc7tXUQJDk7ZNeabdHbpARHSye9lW1-YI0l5qpuSRC0-4oiZyHoN2GKcMCSR9HM32zYYd7-DoZsju2b1ycVqrNyWwPHtpRYylavOFM6kiIBiUmyp0vfQmBPEE-3wLDXqYAwe8cZhlOhbFBsSsmPyra1zathCp1fKoKYr6Yb",
          widthPx: 1500,
          heightPx: 994,
          authorAttributions: [
            {
              displayName: "Gruen Agency HCR - ManorCare",
              uri: "//maps.google.com/maps/contrib/112648436131462249884",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUQgVX4-ME2RI7Y7SIdEhmRVjqciv2I49M55qS-aN2qCrUm4xhY=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJlzo_Kxg_xIkRsgHFhZGApQU/photos/AUc7tXW9MbHVWFqB_Q92Rbrf8kygP3PrJ7aui2mim2s-mbk7V1OQvBfEx5VCMI6Sua4TEA-tYXiNQj_s6pCHV5UfndrTq1NB4biu3LZ-nIMOXkZe6mc9-adE5aEXKrWrIDyoHbYwfSTzdMdrD27wG--cQUGBaWccVk95OEhF",
          widthPx: 1500,
          heightPx: 994,
          authorAttributions: [
            {
              displayName: "Gruen Agency HCR - ManorCare",
              uri: "//maps.google.com/maps/contrib/112648436131462249884",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUQgVX4-ME2RI7Y7SIdEhmRVjqciv2I49M55qS-aN2qCrUm4xhY=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJlzo_Kxg_xIkRsgHFhZGApQU/photos/AUc7tXWToWTyO2x-AMkBp42TmeaqJg54UXDxJI8pjByF5NDzwA6UJseinIL68W0uL4oUX6oG5rDWG-4nRaoXVJwSX_nNh0zt9-SLAIm9L-iJsr8bRUDlr8ClHNxYqUnSwkeCsvsX3ckOtFQI_j6Wunh7F7JWCTNbAyiEGmq4",
          widthPx: 1430,
          heightPx: 1000,
          authorAttributions: [
            {
              displayName: "Gruen Agency HCR - ManorCare",
              uri: "//maps.google.com/maps/contrib/112648436131462249884",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUQgVX4-ME2RI7Y7SIdEhmRVjqciv2I49M55qS-aN2qCrUm4xhY=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJlzo_Kxg_xIkRsgHFhZGApQU/photos/AUc7tXV73EGRe4BkjIAlMYj-RK1Xo0oGhIEyB6yU_DcuhMDikb7Wum303Rcomko6PxRhmB0cdsLWficwyozQx2qPzP2QMDzDX3STnDf8BhTwpF6kBb-AXDs5IQDWrQxcyggDsJLHb6nbfx1WYL3N27KzLBMMtCHvH_ceRr_9",
          widthPx: 1500,
          heightPx: 994,
          authorAttributions: [
            {
              displayName: "Gruen Agency HCR - ManorCare",
              uri: "//maps.google.com/maps/contrib/112648436131462249884",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUQgVX4-ME2RI7Y7SIdEhmRVjqciv2I49M55qS-aN2qCrUm4xhY=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJlzo_Kxg_xIkRsgHFhZGApQU/photos/AUc7tXWpxvgsekInL7UAqGq3_cR8dZXA2UeuNEujdmh9Q6tCPZ23jnQgUVDCwuzte30HMmEj6JzW8vERVRSZ413g4ZzG032gcOfE9UfKd18EMscL2c22mmpB5ojz3Q3vh6Y2y4YJ8L5YVmoVUBAuD3Sc3ggYMdkVHP4q9CQB",
          widthPx: 1500,
          heightPx: 994,
          authorAttributions: [
            {
              displayName: "Gruen Agency HCR - ManorCare",
              uri: "//maps.google.com/maps/contrib/112648436131462249884",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUQgVX4-ME2RI7Y7SIdEhmRVjqciv2I49M55qS-aN2qCrUm4xhY=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJlzo_Kxg_xIkRsgHFhZGApQU/photos/AUc7tXWrLZob0c3qHfAVs2eGGLTHIfXm_vZc7rmncuORIE_UHURGpAUPRhNiCHzNySVGQ5QXNegKuTnUCbHr5aFJlNRh1rN3kBsrB713KUgGyy3Pl8j4h3yyZoq2PY6c_5NSop8FMha91al2tbdGhUGxUawnEt8jxbiQXsAB",
          widthPx: 1500,
          heightPx: 976,
          authorAttributions: [
            {
              displayName: "Gruen Agency HCR - ManorCare",
              uri: "//maps.google.com/maps/contrib/112648436131462249884",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUQgVX4-ME2RI7Y7SIdEhmRVjqciv2I49M55qS-aN2qCrUm4xhY=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJlzo_Kxg_xIkRsgHFhZGApQU/photos/AUc7tXX1iBw3A6CPbQyi5sAIeABo8OgVJvi6MxyavK5RNZ9eJ4Ad6prBSr-Wl-lKWjalmQe-66KD2zGApiYl5aHtmtAmjf8WulyIY75lsW4UqOHAacKcQ87QT2TUm_ZGoiZbraYzBvX7kRdkqK5ilnmeS4IM7JmMTWXsZC_b",
          widthPx: 1500,
          heightPx: 994,
          authorAttributions: [
            {
              displayName: "Gruen Agency HCR - ManorCare",
              uri: "//maps.google.com/maps/contrib/112648436131462249884",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUQgVX4-ME2RI7Y7SIdEhmRVjqciv2I49M55qS-aN2qCrUm4xhY=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJlzo_Kxg_xIkRsgHFhZGApQU/photos/AUc7tXW8kBL7EDj2xcn_FLSlywYea-TTK83kP2Xy16D26g6aO4TAkHZtIdqU3nFqCSldGGh2vY9F3xazsUN-7TgRR_29bS8fSCe57Ieu4Pmn3n5BNfp625JTwb4wFEeTNDB_-hxX6rj4TpkHL02eOrM507ZyU3T2gyqydAo3",
          widthPx: 1477,
          heightPx: 1000,
          authorAttributions: [
            {
              displayName: "Gruen Agency HCR - ManorCare",
              uri: "//maps.google.com/maps/contrib/112648436131462249884",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUQgVX4-ME2RI7Y7SIdEhmRVjqciv2I49M55qS-aN2qCrUm4xhY=s100-p-k-no-mo",
            },
          ],
        },
      ],
    },
    {
      formattedAddress: "65 E Elizabeth Ave # 210, Bethlehem, PA 18018, USA",
      displayName: {
        text: "Childrens Home of Reading",
        languageCode: "en",
      },
    },
    {
      formattedAddress: "2021 Westgate Dr, Bethlehem, PA 18017, USA",
      displayName: {
        text: "Bethlehem South Skilled Nursing and Rehabilitation",
        languageCode: "en",
      },
      photos: [
        {
          name: "places/ChIJZwA1mKE_xIkRxO8LK4ZrasA/photos/AUc7tXV2pGH33F3CJSz4kCQELlm1nttIL24SlXKrBDVQn1eLB7xftP7kTpbuTk5_3DONEaMynxYYDZl0xUOr9bkUD0MLnoc8ylnrhHilSSsI3vcLNbT9BAB6cHFNgTMcWtXcbpIakAe4_4zsS9EyOVyz-mR2x_u-WjbYNDAX",
          widthPx: 500,
          heightPx: 331,
          authorAttributions: [
            {
              displayName: "Bethlehem South Skilled Nursing and Rehabilitation",
              uri: "//maps.google.com/maps/contrib/118219203916037572364",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocIZ-RuiQVu91q_okqgaM3bKrSz5Q89ELQaisHaYutw5hKqeFw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJZwA1mKE_xIkRxO8LK4ZrasA/photos/AUc7tXVVn7qXDjca6ES9cpd2BnpsHbKatsGIN0wJCZdG2QrWiaUnGnk4_E0LkOPyOPZg5KfRVlpTI0LoYn-NTRLDEucIk8vd-75F6d2Yp9l38_OPTb2i988eJBMbnpY9n0ju1Vk0DLNYBDHs1PT30RMzxxY5TSM6v0WHamhB",
          widthPx: 500,
          heightPx: 331,
          authorAttributions: [
            {
              displayName: "Bethlehem South Skilled Nursing and Rehabilitation",
              uri: "//maps.google.com/maps/contrib/118219203916037572364",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocIZ-RuiQVu91q_okqgaM3bKrSz5Q89ELQaisHaYutw5hKqeFw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJZwA1mKE_xIkRxO8LK4ZrasA/photos/AUc7tXWB65lBVIfIjOUUjOJNq2LJ1FD8j-ZJl3DE-ugIx1QtQYUQ2uX736Q8oSa5tblYDbICkoxHnony-goPwdJO1BShm2tC4ONAKcEZqquIMEQ0cU47pK8CIrod8UJs57R-XsRjKt9zkhc60QdOMzLB4auDsZWB1QaW4xKu",
          widthPx: 500,
          heightPx: 325,
          authorAttributions: [
            {
              displayName: "Bethlehem South Skilled Nursing and Rehabilitation",
              uri: "//maps.google.com/maps/contrib/118219203916037572364",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocIZ-RuiQVu91q_okqgaM3bKrSz5Q89ELQaisHaYutw5hKqeFw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJZwA1mKE_xIkRxO8LK4ZrasA/photos/AUc7tXUc3qa9WIrTY0GEDJzqbeMbvF9dkua_tZpeFoh8Ck0lj4TRnF7RFMCb-kvux3uumMBpiFEzzoQ-UBoa0K3wK6TlzeCX0huyHYEkLrJGqrEFEqRcs8tPSEC7LgHCePop-0sgID1BUOKPIgQKtyZVl46XRtc09p8EqlvD",
          widthPx: 500,
          heightPx: 331,
          authorAttributions: [
            {
              displayName: "Bethlehem South Skilled Nursing and Rehabilitation",
              uri: "//maps.google.com/maps/contrib/118219203916037572364",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocIZ-RuiQVu91q_okqgaM3bKrSz5Q89ELQaisHaYutw5hKqeFw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJZwA1mKE_xIkRxO8LK4ZrasA/photos/AUc7tXUEjw3nU96RrnuOjd5o3JW2knca0-yIipKs89LjlXAZs-yTqBtWonBL48nL36fBOh15tMOBeExmUSxDoyWhgzATFpDsw6A7bMszqCP1fZzn7qEyYv_96-X4XQuLxKcBTOn9B12JvqdOkHUAEDHMim-3P7jwmjr1hUR4",
          widthPx: 500,
          heightPx: 331,
          authorAttributions: [
            {
              displayName: "Bethlehem South Skilled Nursing and Rehabilitation",
              uri: "//maps.google.com/maps/contrib/118219203916037572364",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocIZ-RuiQVu91q_okqgaM3bKrSz5Q89ELQaisHaYutw5hKqeFw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJZwA1mKE_xIkRxO8LK4ZrasA/photos/AUc7tXWyWtwivzpN42X9tMtZUA3c2gU8yfgN4cveRhO_fPXlVQSuCpRQQWQPH24iOUQNlEJCynWbCBo8WHy6leVGo47xNpngo5shbYtPzxbkmO8mXtkWhLkOWzfEibgi7AaOPoG0FJa_aI_C818hVvoV_uOpqQgtrmUx-cvm",
          widthPx: 500,
          heightPx: 331,
          authorAttributions: [
            {
              displayName: "Bethlehem South Skilled Nursing and Rehabilitation",
              uri: "//maps.google.com/maps/contrib/118219203916037572364",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocIZ-RuiQVu91q_okqgaM3bKrSz5Q89ELQaisHaYutw5hKqeFw=s100-p-k-no-mo",
            },
          ],
        },
      ],
    },
    {
      formattedAddress: "3534 Linden St, Bethlehem, PA 18017, USA",
      displayName: {
        text: "Alexandria Manor",
        languageCode: "en",
      },
      photos: [
        {
          name: "places/ChIJh2NbFwRAxIkRZF7XtKZ-Adw/photos/AUc7tXU6ahMoARAFwSqMmfi01YuRoRMsQxxJgIkOXMs3hOXt2VkL09L9OkraNVRil2I6LX6rOvDpKzEVN77__6PNTQKCdhzNvPXHTzQ_EUaGDdEEhHeFB-u1SMWc7tlofeC4DQrsoy0nEfQOpg0mstECuyGG7t34Xux9MDqp",
          widthPx: 800,
          heightPx: 526,
          authorAttributions: [
            {
              displayName: "Alexandria Manor",
              uri: "//maps.google.com/maps/contrib/108421797681894123087",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXuITCg1LJ_viQsD8rHngNxuurF5QCJq45DtQjUyhmwdOs0J7c=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJh2NbFwRAxIkRZF7XtKZ-Adw/photos/AUc7tXV6dSTZRhaQlR45Kd5Ba4uwH7DPzluzNSZjHJNlX0RYbSdevbDIWbl71OsGCKzPzI1yluYaaZYmZhoZYcBWI86bGg4HI_fjqwXvxzH57NeANPOi0Ki98xSv-9iYG65GZXf3l3wDagaO5ncpW6FcjTjTnNZJ-31YkWBH",
          widthPx: 720,
          heightPx: 960,
          authorAttributions: [
            {
              displayName: "Alexandria Manor",
              uri: "//maps.google.com/maps/contrib/108421797681894123087",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXuITCg1LJ_viQsD8rHngNxuurF5QCJq45DtQjUyhmwdOs0J7c=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJh2NbFwRAxIkRZF7XtKZ-Adw/photos/AUc7tXU0NQFLBWKyByf8gRqL0yHYfW6NVXHDSyUnZbLpy5d75Z6DoTXoVN01g8Dh8Njh2ZH30tuxtoM9BDnwWMfPsMs_-2aXAZ06AOr7LLLkQOkVOfX9QC7SBtKU_QdpEtonRrc_XCTQK8sm5kqcs9U-pvyZSXVvj9nKP7Cc",
          widthPx: 800,
          heightPx: 541,
          authorAttributions: [
            {
              displayName: "Alexandria Manor",
              uri: "//maps.google.com/maps/contrib/108421797681894123087",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXuITCg1LJ_viQsD8rHngNxuurF5QCJq45DtQjUyhmwdOs0J7c=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJh2NbFwRAxIkRZF7XtKZ-Adw/photos/AUc7tXUx5EG83qKnl0LoR-18LBg7qHgdo4aVr0W7sVdiaU_YDV8K5TJsM7jW02qbUQUap0sltAJRluFyRA7DHaUPHf0IHQadv-U2oL9jHglRUx5P8hsaHRS2HdJnbGV9ROuh_Mny4cCcf3Ezsz0En15R4DyikZyHDEAxMSIH",
          widthPx: 4000,
          heightPx: 2665,
          authorAttributions: [
            {
              displayName: "Alexandria Manor",
              uri: "//maps.google.com/maps/contrib/108421797681894123087",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXuITCg1LJ_viQsD8rHngNxuurF5QCJq45DtQjUyhmwdOs0J7c=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJh2NbFwRAxIkRZF7XtKZ-Adw/photos/AUc7tXVzur5OMFs7Hrr-n_wvGGDJZs0CIRYCM0qcTgM31lwPvH285Za1QvdsMe2a9grmhCMekeitNjVDCSyvkDnEa0adC_HMNuI1W3t0TY11EO0Py0IrOHPd9QuQlkpxBxUAbozdmf5RFeya0sbnEtoCLqOJ2hsNR3r1JZ-I",
          widthPx: 960,
          heightPx: 720,
          authorAttributions: [
            {
              displayName: "Alexandria Manor",
              uri: "//maps.google.com/maps/contrib/108421797681894123087",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXuITCg1LJ_viQsD8rHngNxuurF5QCJq45DtQjUyhmwdOs0J7c=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJh2NbFwRAxIkRZF7XtKZ-Adw/photos/AUc7tXW9cVnwCWrDt3iifqO5qv3CoJfgj_eiK1fUpxO1dApIPynTKjhQCPHEghIwZRqtlDaSi6T7molB6lArkis5UJlzLAnYVw6KRQSZffUSqMBa_fsi42LVX8_tlbqOy7m3d3ZrW6ENapuGSG0rkLiwutSxZUPS4js5LPvt",
          widthPx: 800,
          heightPx: 529,
          authorAttributions: [
            {
              displayName: "Alexandria Manor",
              uri: "//maps.google.com/maps/contrib/108421797681894123087",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXuITCg1LJ_viQsD8rHngNxuurF5QCJq45DtQjUyhmwdOs0J7c=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJh2NbFwRAxIkRZF7XtKZ-Adw/photos/AUc7tXV0bcAYrsUWsoWvM1SEFsbygORdCYQSeP3uR-pXGken4rok48isxHGkgCl9rSVj9murpwIYGbKpxalvM1uRcCJk3WlAfHUEtwsQd6IZbBogFFr77YmIEofMi6pFw4gz0yElAz_nWLUzCC1szRuHo5-061g5l9nxXLTs",
          widthPx: 720,
          heightPx: 960,
          authorAttributions: [
            {
              displayName: "Alexandria Manor",
              uri: "//maps.google.com/maps/contrib/108421797681894123087",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXuITCg1LJ_viQsD8rHngNxuurF5QCJq45DtQjUyhmwdOs0J7c=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJh2NbFwRAxIkRZF7XtKZ-Adw/photos/AUc7tXXswbZAraebX1AlvuM0igmJBe8lj12SljN5ZrhR6XHU5hNJhGYF-aF6q8nD-2O1TC3FRD4f1w4ZiP9BuCAb8m-6MshC0GUL_FD43Gl7vVX-OFH7Htb2Qzq4WQKk1miE5e1mWboZ9G0IUMTIEjsMQ5Y0V_MNzRv21Lui",
          widthPx: 960,
          heightPx: 720,
          authorAttributions: [
            {
              displayName: "Alexandria Manor",
              uri: "//maps.google.com/maps/contrib/108421797681894123087",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXuITCg1LJ_viQsD8rHngNxuurF5QCJq45DtQjUyhmwdOs0J7c=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJh2NbFwRAxIkRZF7XtKZ-Adw/photos/AUc7tXUKFt808gn9vcnIgZUxjGJh2i7U8MLI2nxQCX-IaVPawX93AGtdyh2E1TmglgsOGp4e0EkZTPkbdTJPMIAQQTn1BLri6KRbohGEqOQs-TpimNLBZ3VITrbJ2_fxYnTQ8DvFstNph57QHAUZn-fpZFFUr2ymyVc4cY8Z",
          widthPx: 800,
          heightPx: 530,
          authorAttributions: [
            {
              displayName: "Alexandria Manor",
              uri: "//maps.google.com/maps/contrib/108421797681894123087",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXuITCg1LJ_viQsD8rHngNxuurF5QCJq45DtQjUyhmwdOs0J7c=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJh2NbFwRAxIkRZF7XtKZ-Adw/photos/AUc7tXX_BNXtEgWhttZBuGQ2QNMWp-TQZnzjIrQPDIrcNCEkfCaZxTFfHqxOvipmactiLTsooKmpfvI4Is8xmxRRlSuJsTiROk-JArbi3HyjPC5IvD1KlznXGqdhvITO35vLeMvKT9gCHG7_-t3XbaPHGdbtMyi5BDwkhlDN",
          widthPx: 960,
          heightPx: 720,
          authorAttributions: [
            {
              displayName: "Alexandria Manor",
              uri: "//maps.google.com/maps/contrib/108421797681894123087",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXuITCg1LJ_viQsD8rHngNxuurF5QCJq45DtQjUyhmwdOs0J7c=s100-p-k-no-mo",
            },
          ],
        },
      ],
    },
    {
      formattedAddress: "714 W Broad St, Bethlehem, PA 18018, USA",
      displayName: {
        text: "Cay Galgon Life House",
        languageCode: "en",
      },
    },
    {
      formattedAddress: "815 Pennsylvania Ave, Bethlehem, PA 18018, USA",
      displayName: {
        text: "Bethlehem Manor",
        languageCode: "en",
      },
      photos: [
        {
          name: "places/ChIJpfLwMtw-xIkRmdlyVnH2PoU/photos/AUc7tXWoOswai6Pa8uZzZ7zicXrMOEpmh8TeXIMblbvKvM7CzXmEAXCs_u4eXNOGGPh3ACsTHgi5DHO74sgAAAc1rlP-NRH1T7w9u1RCL2OWKraT8nNDr90TKMU1MAjlkbXnw2H5t69yAVt2-zPpYBbnTH7K24bvsfBEBNkp",
          widthPx: 720,
          heightPx: 720,
          authorAttributions: [
            {
              displayName: "Bethlehem Manor",
              uri: "//maps.google.com/maps/contrib/101234757044502932375",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjU6nlH8QFl-PPdxmWQYnfAMxz1neXgcyxxDAt1V6SldSVSx1yo=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJpfLwMtw-xIkRmdlyVnH2PoU/photos/AUc7tXXlVbDE4bz7zH0cllsHfeaT5WDfMHQSJX4kSAnUiTxr68rhgHsaQWyU-skwdDZ2Ncs7RpSaUMU3U-gKib4vpt-qitpdI8xeBVExqxd0W0Qhe_CGEfCaUsTMfuBZipMwpf18MywEad-W5vWdKrKYNU8m-m4zC4E4GFQ0",
          widthPx: 720,
          heightPx: 720,
          authorAttributions: [
            {
              displayName: "Bethlehem Manor",
              uri: "//maps.google.com/maps/contrib/101234757044502932375",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjU6nlH8QFl-PPdxmWQYnfAMxz1neXgcyxxDAt1V6SldSVSx1yo=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJpfLwMtw-xIkRmdlyVnH2PoU/photos/AUc7tXWu_g0Qqhvvqrp6sxz7GIEwVxYCO5nCHGMR1ZBt-caeyqaeKAwE4N6ZIMJ0nZb0Iog0Y3czkM68C6HMqx2TmKRdbdkUdX92svI_3iBWPujOuXm1ATPH6AnEu82YXnWSetfesZeOOZsjNTlSgkeLfbjylHyDnN1QX7OF",
          widthPx: 720,
          heightPx: 720,
          authorAttributions: [
            {
              displayName: "Bethlehem Manor",
              uri: "//maps.google.com/maps/contrib/101234757044502932375",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjU6nlH8QFl-PPdxmWQYnfAMxz1neXgcyxxDAt1V6SldSVSx1yo=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJpfLwMtw-xIkRmdlyVnH2PoU/photos/AUc7tXUy2rxca75L_EsaZkcNB4Mgbeqkh-KRslUVJLnjEVS7I9LYo2WwIJA1QulX2v5xKHo2yp8_XQ-SCOSp3vsTEOxO8H9uNP42CGSrWxoaZqNfvQQGGNNPkVlUbpzFPujjZEYb4iOfxlisdR05-nXHSATaVkwJ9Jnkeodw",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Jacob",
              uri: "//maps.google.com/maps/contrib/112380276910827728252",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWFHpO6Tn_0MxaK6lzU7EFr2lVARwZzs72R7YaxMGPYWv5mMJ-3=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJpfLwMtw-xIkRmdlyVnH2PoU/photos/AUc7tXUkgUyvEfUcwH-7sk9RDX5-Fm04OpMUfFi26f9f2xe2RgmcY03jKcKeT5u-LjDFO9VmSw7v30nWCoqCK-RYQ4rHT9za9aSAZqQCEzxj16orQsCFdwEf7z9ftBrlCUQYC4olbjy0t4MeD3iOJEgOIocfVcxJRG-o5zGg",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Jacob",
              uri: "//maps.google.com/maps/contrib/112380276910827728252",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWFHpO6Tn_0MxaK6lzU7EFr2lVARwZzs72R7YaxMGPYWv5mMJ-3=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJpfLwMtw-xIkRmdlyVnH2PoU/photos/AUc7tXWTmVNzGa7DM2MNEzQAqluTqFF47WMopGIGsq3Mh7Xnbr7fNHbJrk60CxVkc1tsczcXROWlph4uNUpVF50441JewNXc_IxO-sICtMbrxhXmsFGv1fMTr8o8Dv0-V2CgSYjyC04w2ahzZt9P0z9b8e3hNvnK8fzsr7LC",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Jacob",
              uri: "//maps.google.com/maps/contrib/112380276910827728252",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWFHpO6Tn_0MxaK6lzU7EFr2lVARwZzs72R7YaxMGPYWv5mMJ-3=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJpfLwMtw-xIkRmdlyVnH2PoU/photos/AUc7tXXm9tZZeLhFMvA5M8oidoBhI36wfNhK5mKTREE2hEyMUI6jE1CiPyDMfwYByDqycC43IruntuvXyZje_dqJz9diUpTomveE4pT8GJiDpHiClOW-jww7ipBoqSQkEVDbhn5eNzE-GOEAfwrdXW5SDaT1OXGpQdA061L2",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Jacob",
              uri: "//maps.google.com/maps/contrib/112380276910827728252",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWFHpO6Tn_0MxaK6lzU7EFr2lVARwZzs72R7YaxMGPYWv5mMJ-3=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJpfLwMtw-xIkRmdlyVnH2PoU/photos/AUc7tXWHk3QIJCXTjdFS3WM9aJCZj2Jg5yEtai0sk1TJa_aBrbN7mFS52DhSQDZI2-AHZfJffBewLBOj6yIkIjuwVz29SlumoNYj1kSOcoKlFXgEJluQNt_n661_yQ1Q0B3JEfC5egBl7bpLByZXTBAnQU-_Nu5fDn6-qn1M",
          widthPx: 4032,
          heightPx: 3024,
          authorAttributions: [
            {
              displayName: "Jacob",
              uri: "//maps.google.com/maps/contrib/112380276910827728252",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWFHpO6Tn_0MxaK6lzU7EFr2lVARwZzs72R7YaxMGPYWv5mMJ-3=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJpfLwMtw-xIkRmdlyVnH2PoU/photos/AUc7tXXG867HTdpCwczkGTTqWgxkScWS3EcMW2u1PC_uU3Rxgp6g520FrMc7RFAazCAM9raM6PT3wIkE8I0p5hQHBgTl40PPc_B-KKSkMNBhwEyVKmLTDd6GvONMzn2wwtfiT8bOaIY4Dgy-3tRg5xOR8dzJ5umyIftFj5db",
          widthPx: 720,
          heightPx: 720,
          authorAttributions: [
            {
              displayName: "Bethlehem Manor",
              uri: "//maps.google.com/maps/contrib/101234757044502932375",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjU6nlH8QFl-PPdxmWQYnfAMxz1neXgcyxxDAt1V6SldSVSx1yo=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJpfLwMtw-xIkRmdlyVnH2PoU/photos/AUc7tXX1APUzg1bH-VMv-MMbJf0kgmL9G4VKppQPHcAKWW65iauS4-HtWiiLaBvdH6FyjSYg6kGUCLoK80PpHRF4ywwSTdnb1SuEqV4GfAHySekUvn-rcx6sJZj95_FdHFcGugBVZVn3zWUC3_Qoebl9tLTCOfa3F_2TWsVj",
          widthPx: 720,
          heightPx: 720,
          authorAttributions: [
            {
              displayName: "Bethlehem Manor",
              uri: "//maps.google.com/maps/contrib/101234757044502932375",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjU6nlH8QFl-PPdxmWQYnfAMxz1neXgcyxxDAt1V6SldSVSx1yo=s100-p-k-no-mo",
            },
          ],
        },
      ],
    },
    {
      formattedAddress: "1200 Spring St, Bethlehem, PA 18018, USA",
      displayName: {
        text: "Catholic Senior Housing & Healthcare Services Inc.",
        languageCode: "en",
      },
    },
    {
      formattedAddress: "333 W 4th St, Bethlehem, PA 18015, USA",
      displayName: {
        text: "New Bethany",
        languageCode: "en",
      },
      photos: [
        {
          name: "places/ChIJNwmk9l4-xIkRIr9jjRWS3jo/photos/AUc7tXXF_cE-MlBhu9gMoWch8CYl8ECtRBRgdbu9ZidlK_m_Jejv5rCn4YlIy5iiQtNAdjD8xhb5f3qq52-JJRZJnY7BJkm3wJN1bkSfThSMB3x83B0M6pw5-3Ra2Vi7hcta5UgIz_02qf54IqMTu64irkVEzoy522pAI6pd",
          widthPx: 4000,
          heightPx: 6000,
          authorAttributions: [
            {
              displayName: "New Bethany",
              uri: "//maps.google.com/maps/contrib/102118100053856514826",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXq-oMzhDnGwZ4cCHjgOHePT113WBG1bu6fzKYuhO6XZo5QcOQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJNwmk9l4-xIkRIr9jjRWS3jo/photos/AUc7tXWqYnm7wlWSZccoJyqtOrwQta4eP6XgdHqwRUrHuL6gEaTyDqPQHAHjounjtnjeJFB9wOzPScwDaV1BqYhsjjPJrq9taJO5XVvO4bx9FVNyctRUkpADcQeIQJV0XTTZhDdO4-sTVwzorg9iaHO7m35PueRJb0ZRolOM",
          widthPx: 6000,
          heightPx: 4000,
          authorAttributions: [
            {
              displayName: "New Bethany",
              uri: "//maps.google.com/maps/contrib/102118100053856514826",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXq-oMzhDnGwZ4cCHjgOHePT113WBG1bu6fzKYuhO6XZo5QcOQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJNwmk9l4-xIkRIr9jjRWS3jo/photos/AUc7tXVVORPhVlWAJ5mpYIMdxcXeMiGhktJ9ePDOautBEfbw3FBgboKnr-R423fWh975iQwUeyNt3xHZ3ZCpfp6xCqSG73I3Ya_Tu1eUK8_DzpFDARzDqu-08cK6HC4wl6IZsNIFAeYSObWJjeSrKdQ35z6FaElQC_9_bCKc",
          widthPx: 1836,
          heightPx: 3264,
          authorAttributions: [
            {
              displayName: "Sharon Kubeck",
              uri: "//maps.google.com/maps/contrib/112338557130072442011",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUgYePAxcRcSzARNYycv-aGyTnN4rMU-Vs2teOA6WTBhGatruKypw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJNwmk9l4-xIkRIr9jjRWS3jo/photos/AUc7tXW5W395sDWMNpX3i-KiQu_axOkW19HHOBv2-6c7FIrqZV0SSFB-IfzUdMtroaMxVm6tT9UOycXcm42oRuzgUT_ML3ZJiE70AXljrBz1d7zttGNyPoi1hk6EQWyIhib6ljuwN4SBqTNVlvve6QMM5C5TfTovG0P2w5PV",
          widthPx: 6000,
          heightPx: 4000,
          authorAttributions: [
            {
              displayName: "New Bethany",
              uri: "//maps.google.com/maps/contrib/102118100053856514826",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXq-oMzhDnGwZ4cCHjgOHePT113WBG1bu6fzKYuhO6XZo5QcOQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJNwmk9l4-xIkRIr9jjRWS3jo/photos/AUc7tXVSlAk5bXvBjQgpiNCRwdco2WfYiv1tzonUt2KzjNTRGFrWqBeOyLEXwxEI8S_WABKqymMw-lL3MI5b7JRUJPwCyM193cm56OfFWPW1EDXLdIe23OWAfpDipYcw_nOvouUMBAywUyRsPU4cx0sgXkQU9liEKjjnGooj",
          widthPx: 1836,
          heightPx: 3264,
          authorAttributions: [
            {
              displayName: "Sharon Kubeck",
              uri: "//maps.google.com/maps/contrib/112338557130072442011",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUgYePAxcRcSzARNYycv-aGyTnN4rMU-Vs2teOA6WTBhGatruKypw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJNwmk9l4-xIkRIr9jjRWS3jo/photos/AUc7tXVjRnL_RC2U_wXWtQ5VeguJQIgSsZUrZF-J83KATYrC9GKcIDkzl4zy_EHfY3ipScq_L_rzNkETEzFsfLBdFdQqrhe97cVqjrZN2AQDM7PcSQhKd02psZBylTpl0hJDJsZ2y0bmeflN-PT5wHJHQhuyToHiWwyAlNnY",
          widthPx: 1836,
          heightPx: 3264,
          authorAttributions: [
            {
              displayName: "Sharon Kubeck",
              uri: "//maps.google.com/maps/contrib/112338557130072442011",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUgYePAxcRcSzARNYycv-aGyTnN4rMU-Vs2teOA6WTBhGatruKypw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJNwmk9l4-xIkRIr9jjRWS3jo/photos/AUc7tXW8WmibezMZHKVA8WlqFn8CxwfwVe73pDsD1bXm4Gfs1c6w6vWtz9-em6HfC5EKX5Ybq6z_hMiJDe8TBhzSxa74Vr6MC6mlJrfwIBP5mO5YRwaizMyjZt81i0JqyynFAW5jbJgv9MwE1TZChR5DCBw_1weKeiilquUO",
          widthPx: 1836,
          heightPx: 3264,
          authorAttributions: [
            {
              displayName: "Sharon Kubeck",
              uri: "//maps.google.com/maps/contrib/112338557130072442011",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUgYePAxcRcSzARNYycv-aGyTnN4rMU-Vs2teOA6WTBhGatruKypw=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJNwmk9l4-xIkRIr9jjRWS3jo/photos/AUc7tXXcQ88crdzPC7h7lShb_ycBsrHJ3n9ywbKuMmBHv5unE18sZbMK_6sUx3bfM9MR6FbRbe8e9EejJWiaw-WRw4VM_RFCRMO6GhFsJsfKL4D8bSUS1ET3jpKCHJ4RB3t1tdc0sIFuYkMYl2OOeEDwGDjJQA_K0aG360o",
          widthPx: 3072,
          heightPx: 4080,
          authorAttributions: [
            {
              displayName: "George Wacker",
              uri: "//maps.google.com/maps/contrib/111972535676428806829",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXxD40EULNQ0S3S_IU1zOHZqKFyQ5o0IvfQO93RN26cqzslvtCU=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJNwmk9l4-xIkRIr9jjRWS3jo/photos/AUc7tXVUE9GjGaF4rMm81DM9ZlwKJY2NghXaEEeZ7gf-PErn7Yy8IZrfYg4baKPgAxlwrR4dyKjrQfVt2fVAbAw6YpeK1rt4b-6qFc38yAghg9w1l4AgY8MuyPopoE_pSOaiQuTL9MDuHp5TLoqkdATNv_83RG-4KxbmUYA",
          widthPx: 4032,
          heightPx: 2268,
          authorAttributions: [
            {
              displayName: "George Wacker",
              uri: "//maps.google.com/maps/contrib/111972535676428806829",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjXxD40EULNQ0S3S_IU1zOHZqKFyQ5o0IvfQO93RN26cqzslvtCU=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJNwmk9l4-xIkRIr9jjRWS3jo/photos/AUc7tXVdnELmCpIv3hCcMc-whyFVPP1iVvqANKCGUWdIPNDdWumDKm7jPmbjUHvNuPfkrGLC4I5J8EPmOpAmkOzsEBDha_BQzA11JU_8wEoHkeCAajSCZLeWYyfQdrq2lCPanzztjjgXW975REHhEETLwguFszbQv-zE-1wx",
          widthPx: 3264,
          heightPx: 1836,
          authorAttributions: [
            {
              displayName: "Sharon Kubeck",
              uri: "//maps.google.com/maps/contrib/112338557130072442011",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjUgYePAxcRcSzARNYycv-aGyTnN4rMU-Vs2teOA6WTBhGatruKypw=s100-p-k-no-mo",
            },
          ],
        },
      ],
    },
    {
      formattedAddress: "4025 Green Pond Rd, Bethlehem, PA 18020, USA",
      displayName: {
        text: "Country Meadows Nursing & Rehab Center",
        languageCode: "en",
      },
      photos: [
        {
          name: "places/ChIJuzXuHoRrxIkRJLIZPSifOd4/photos/AUc7tXUBujePAR2eOHtBXUBDB_O9u2hEjE-4seZIFj70MkJe9_As2QIRYEswcRhPTc5GoZu5FTccXN10re4EzILv6cJAsL1N5OLk9YqQmj-bLJyCBwMpjy82_2i9kcAtp7jY-vBKyOQup--2_JjRZBEuNDgTiS-KHESRjElC",
          widthPx: 2048,
          heightPx: 1366,
          authorAttributions: [
            {
              displayName: "Country Meadows Nursing & Rehab Center",
              uri: "//maps.google.com/maps/contrib/103894622676050133744",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWc2pYMd5AuFKuSivdkiQGFFshkZmOzr3WrdEVNMqYCSeG7vzQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJuzXuHoRrxIkRJLIZPSifOd4/photos/AUc7tXUTwX5stSoxjrTGOoziM0h7mIxJ16TCZbd7HA3Ce5gWnT_xjSRgDZGhNSbebUai8J9BX523BH5GofjnYmpmQArrqAwGFmm6dB2s2fMeS04GICIY_1qfXF3V2CxdDCGFdC6igwbs1D3fPROv2194yoGtKTo6nZfP193M",
          widthPx: 3840,
          heightPx: 2160,
          authorAttributions: [
            {
              displayName: "Country Meadows Nursing & Rehab Center",
              uri: "//maps.google.com/maps/contrib/103894622676050133744",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWc2pYMd5AuFKuSivdkiQGFFshkZmOzr3WrdEVNMqYCSeG7vzQ=s100-p-k-no-mo",
            },
          ],
        },
      ],
    },
    {
      formattedAddress: "1318 Spring St, Bethlehem, PA 18018, USA",
      displayName: {
        text: "Catholic Senior Housing Development",
        languageCode: "en",
      },
    },
    {
      formattedAddress: "634 E Broad St, Bethlehem, PA 18018, USA",
      displayName: {
        text: "The Healthcare Center at Moravian Village of Bethlehem",
        languageCode: "en",
      },
    },
    {
      formattedAddress: "2000 S 25th St, Easton, PA 18042, USA",
      displayName: {
        text: "The Children’s Home of Easton",
        languageCode: "en",
      },
      photos: [
        {
          name: "places/ChIJPdCYI6JsxIkRUMsJYrta9tM/photos/AUc7tXUie-KoHock3lc_kxN2xzKRnr9ijhKVLQiZS_2V2uxSOiwICjz8YDxsJj65EI-wvLrigfIOgognInmEhznbmRnJYo864Lp28hERwnN9_Jz0kc9qvc1iZYfob33F_A1FRpZNPNwVrIBZX0f6woA9mCAcQo1VnDKPdzWk",
          widthPx: 960,
          heightPx: 720,
          authorAttributions: [
            {
              displayName: "The Children’s Home of Easton",
              uri: "//maps.google.com/maps/contrib/101343924430437170342",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjVQ9Rj7G12loPeemvIReuNFX3N6K9jvhA8v7Pw7Jzp7Pr_1DgE=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJPdCYI6JsxIkRUMsJYrta9tM/photos/AUc7tXXfhHbX3hT-qd2xhnD9GERdS7tSFhS41qhvyfrsAUonsO3tX0Mk7lMWECxArhE6BcdOAWG2AnXC8hmSdkK8bg2lnNQNGHT0JQ6bWq7sjbrRLT1uNLnRfFdLfxeQk4vRNKZdp_PiLe6TsWscl4xcSknSHiYbkoFca2W4",
          widthPx: 4032,
          heightPx: 2702,
          authorAttributions: [
            {
              displayName: "Oksana Lukavenko",
              uri: "//maps.google.com/maps/contrib/108327381648145336502",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWKUaWGoVcH84kFGkOYxn2jSumy29mA1CykeDI_5AGVC0BiyCaQ=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJPdCYI6JsxIkRUMsJYrta9tM/photos/AUc7tXUlKXjKxWZFUR7leejJL4vbTm5h-LnI1f04qqYGhgszmMAZwET5-5miWeKsU94YJxVPaSKytloLiSW_OOr856IWQlXG4u5kJlyYnvWhSnH8WSO6H_LhykKEPlQ_n9akdJEXsijLbiW1_E3CVftK_h9nEtSuTPb6Alw0",
          widthPx: 1632,
          heightPx: 1224,
          authorAttributions: [
            {
              displayName: "Ali Divine Sr.",
              uri: "//maps.google.com/maps/contrib/107336814963055540036",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjWzn_a35eazWL7984O3SsvHGu-stgRDMThhpVp0XxzqcZ4F2VgW=s100-p-k-no-mo",
            },
          ],
        },
      ],
    },
    {
      formattedAddress:
        "Family Center, 1650 Broadway 2nd Floor, Bethlehem, PA 18015, USA",
      displayName: {
        text: "KidsPeace Foster Care in Bethlehem, PA",
        languageCode: "en",
      },
      photos: [
        {
          name: "places/ChIJpW_8N5k-xIkRt6So9UbjzM4/photos/AUc7tXVhAK5UsjR363zauvoiqLJ9lQ9heK9EsgK4N1BIdbEDhWTSXj4JzziloK-_t_aZpOHvlXe3PtKLt3ttlHlsmFaN8bkGnCEYyhPDR5W8nb--pn1LKZO-5Z9rZJFUzwz2MRj1gyjreVIqMWSJPFgSFaM_EhwNA8ZJu5aG",
          widthPx: 500,
          heightPx: 500,
          authorAttributions: [
            {
              displayName: "KidsPeace Foster Care in Bethlehem, PA",
              uri: "//maps.google.com/maps/contrib/110760980138834012056",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjV_fXGXtco-Sr23hR65yNZ5E8_Vo103Bk-E-Yv5kVPxSbP_3hI=s100-p-k-no-mo",
            },
          ],
        },
      ],
    },
    {
      formattedAddress: "1050 Main St, Hellertown, PA 18055, USA",
      displayName: {
        text: "Saucon Valley Manor",
        languageCode: "en",
      },
      photos: [
        {
          name: "places/ChIJbVODiv8VxIkRe2g0ZmWb26A/photos/AUc7tXVsLysUr2uUZkLrT-uhN3ZCDWBWrRG0XOsF59eLi8Giv6kLIReTo_zqnw--Pdd6Sq4z_mS9yBiZRYo5Wo6kuVF9a3RMbiY2DJCPNoHI7IYLdTAx-vMQDYiqeyXyn6jl1EEIU931swroqeSgV2hMroE52YiMcG7tW4YG",
          widthPx: 720,
          heightPx: 720,
          authorAttributions: [
            {
              displayName: "Saucon Valley Manor",
              uri: "//maps.google.com/maps/contrib/102606940358571466169",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjU7TRkYiH4VsBLopGV4xlqD0fVvbHNe3s58qoKtdTIkepC5zqA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJbVODiv8VxIkRe2g0ZmWb26A/photos/AUc7tXVopCax3z3y9sqtDBA2rt06vcg21UO4nwIXonoLvKMsx06emaELusddHMcfPb5WbnqnI2BNLX2S7uiobgDGbZ6FewN6lxcmEDcrp-I7XcbEopsESyEJ3G4_e_bMs2v1jhHWpuh8hfUGRudY2h0F9ychUHMl9ycOSOwQ",
          widthPx: 720,
          heightPx: 720,
          authorAttributions: [
            {
              displayName: "Saucon Valley Manor",
              uri: "//maps.google.com/maps/contrib/102606940358571466169",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjU7TRkYiH4VsBLopGV4xlqD0fVvbHNe3s58qoKtdTIkepC5zqA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJbVODiv8VxIkRe2g0ZmWb26A/photos/AUc7tXVQJzL4kxA_rKpNdaKCV67bFAb8_U0Ns6slEA7NVDVV6f7f2JW0urhVU7VLu22oT9YldULTavhFP4klznMEqztaUQnRHZY1b2-_Z9s78sliFGUU1hbW9T6oCS7A2qgLo931vjxq2IGv4RNKiElWmriz7VyfEB18uT9h",
          widthPx: 5312,
          heightPx: 2988,
          authorAttributions: [
            {
              displayName: "Sunny Sonnenrein",
              uri: "//maps.google.com/maps/contrib/108501917721143384487",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocKGCu_YBp2rJ7-eDotS1ysJ5ywzcvTmBBrftajQQSq7kSvNHA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJbVODiv8VxIkRe2g0ZmWb26A/photos/AUc7tXXTFweKRs4qhR2utaTQNx_0CjXsEw4auS9YfAVO6oZb0xOaCkNTCuOniHGdFkjsfNh7fEVjdgP9Nklrp-UDiUwi7QzXugFGkqAQQoye_AilnzJW0pEBtf1rf1XYGPMCzv0_R-GpcxT4gZ4Eg1Q6iLz-gYrWBPT4n4sh",
          widthPx: 720,
          heightPx: 720,
          authorAttributions: [
            {
              displayName: "Saucon Valley Manor",
              uri: "//maps.google.com/maps/contrib/102606940358571466169",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjU7TRkYiH4VsBLopGV4xlqD0fVvbHNe3s58qoKtdTIkepC5zqA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJbVODiv8VxIkRe2g0ZmWb26A/photos/AUc7tXUsyXDNZUPT2C8RS2xrzS1GroNjGJQd6yg1pRTPGcNNOCyHmo58sDuKfFn20q8ucd69LanAifYP_q5FlWGfB57ygsArT3i0bIBrOnlfLVe70XUOkPtgGjqr0XR0e4Dd-mVFwB7SGH5b5XwmmoC_uVld-1Qhcjld1anS",
          widthPx: 720,
          heightPx: 720,
          authorAttributions: [
            {
              displayName: "Saucon Valley Manor",
              uri: "//maps.google.com/maps/contrib/102606940358571466169",
              photoUri:
                "//lh3.googleusercontent.com/a-/ALV-UjU7TRkYiH4VsBLopGV4xlqD0fVvbHNe3s58qoKtdTIkepC5zqA=s100-p-k-no-mo",
            },
          ],
        },
      ],
    },
    {
      formattedAddress: "5030 Freemansburg Ave, Easton, PA 18045, USA",
      displayName: {
        text: "The Birches of Lehigh Valley",
        languageCode: "en",
      },
      photos: [
        {
          name: "places/ChIJAQAwIy8VxIkR_otSvAP9jrc/photos/AUc7tXXCqwg3x0tlSGe_iJSlBwrwXMdH7Ivw3FXYIp9o8fDAZ9XYYHTtPyXXIVdI_G8cXJLbidU7Rs-yRzG4r2Pk5Qr7rKqyToOd18J-9DsFgsp4GLL62IcJ8A728oJUrgifiyme2mdXG7PwlnMpaY3pRr72nH8bVKYr0vQO",
          widthPx: 1000,
          heightPx: 600,
          authorAttributions: [
            {
              displayName: "The Birches of Lehigh Valley",
              uri: "//maps.google.com/maps/contrib/117728649408014537237",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocLxLF9cHBTE_lWopvidpuS5YXolUNISLK_g26_7j3MAvQSvjA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJAQAwIy8VxIkR_otSvAP9jrc/photos/AUc7tXUqaah2DlzPuV1Y4r2j4fJaYQXvjHPN9zdAMdUNVJuXzqtYO79EqeYvguFspSoY1ncE0ctYJj4gqhTrjkH34RbvwXShXAlJY96arP4xhTkbuKN-6O4XEtvpCU2A_P8CKRBU5CD3vawUZ1wFQF-fzSw-asmj6_YGEfYP",
          widthPx: 1000,
          heightPx: 600,
          authorAttributions: [
            {
              displayName: "The Birches of Lehigh Valley",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocLxLF9cHBTE_lWopvidpuS5YXolUNISLK_g26_7j3MAvQSvjA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJAQAwIy8VxIkR_otSvAP9jrc/photos/AUc7tXUCHtvHH3zvY_JVIt43eXSkHhCGrmpSVnkICEuM5lGGyPlwi37ZnxoRpJOSp1E3qwwbD_-3MrzOtEFWQQDZWnAmPvVMgrQH6u0L6DwPvazbobnOM9y7Weks96VQhfIwUcKBZam2KwlWFKAmbtKc6ezvW0p_I7-zfEL1",
          widthPx: 1000,
          heightPx: 600,
          authorAttributions: [
            {
              displayName: "The Birches of Lehigh Valley",
              uri: "//maps.google.com/maps/contrib/117728649408014537237",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocLxLF9cHBTE_lWopvidpuS5YXolUNISLK_g26_7j3MAvQSvjA=s100-p-k-no-mo",
            },
          ],
        },
        {
          name: "places/ChIJAQAwIy8VxIkR_otSvAP9jrc/photos/AUc7tXVtDdpe1KDe2hfErrQ8bSzolSY93bC_8nLemxZeghS0C7IEVobHhww5ix2GqmoiKBwyIlaw7g1WuM7qy5LcwXl57mUtD2ywshwbKMo2B3TP_ZBQoF0Fe4mP_Ew4wwOfGpBR-69DRCHAq4ocOQLr6vZ7EFjEsnSw36L2",
          widthPx: 1000,
          heightPx: 667,
          authorAttributions: [
            {
              displayName: "The Birches of Lehigh Valley",
              uri: "//maps.google.com/maps/contrib/117728649408014537237",
              photoUri:
                "//lh3.googleusercontent.com/a/ACg8ocLxLF9cHBTE_lWopvidpuS5YXolUNISLK_g26_7j3MAvQSvjA=s100-p-k-no-mo",
            },
          ],
        },
      ],
    },
    {
      formattedAddress: "334 13th Ave, Bethlehem, PA 18018, USA",
      displayName: {
        text: "Holy Family Senior Apartments",
        languageCode: "en",
      },
    },
  ],
};

async function main() {
  const client = new MongoClient(url);

  try {
    // Connect to the MongoDB server
    await client.connect();

    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection("places");

    // Insert data into the collection
    const result = await collection.insertMany(data.places);

    console.log("Data inserted successfully:", result.insertedCount);
  } finally {
    // Close the connection
    await client.close();
  }
}

main().catch(console.error);
