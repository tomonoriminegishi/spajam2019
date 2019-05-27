# SPAJAM2019
SPAJAM2019 東京予選A お題「NEWS」

チーム名：六木本未来ラボ

作品名：「週間#(ハッシュタグ)」

## 環境

```
$ node -v
v12.2.0

$ npm -v
6.9.0

$ sls -v
1.43.0

$ aws --version
aws-cli/1.11.102 Python/2.7.10 Darwin/18.6.0 botocore/1.5.65

$ docker -v
Docker version 18.09.2, build 6247962

```

## アーキテクチャ

![68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f3137313938392f64313262306332662d373434622d356339332d306339652d3936646635366236393134652e706e67](https://user-images.githubusercontent.com/11880332/58420402-24c1b580-80c8-11e9-8bd9-71677cf267b0.png)


## バックエンド構築
デフォルト値を設定していますので、中身を確認しながら実行してください。

### 1.S3バケットの作成の作成

```
cd 01_create_s3_bucket
sls deploy --bucket your_bucket_name
```

### 2.複数のgifファイルを1つのAnimation gifファイルに変換

```
cd 02_create_animation_gif
npm run prebuild
npm run build
sls deploy --bucket your_bucket_name
sls s3deploy --bucket your_bucket_name
```


**※ nodeのバージョンを10.xにするとうまくいかないため、node8.10を指定しています。**


### 3.作成したAnimation gifファイルをmp4ファイルに変換

Animation gif形式だとtwitterに投稿できないようなので、さらに変換する。

Elastic Trancecoderを利用して、Animation gif → mp4へ変換する。

Elastic TrancecoderがCloudformationに対応していないようなので、
**プリセットとパイプライン**を手作業で設定する必要があります。

#### プリセットの作成方法

Elastic Trancecoderにデフォルトで用意されているプリセットをコピーします。

<img width="976" alt="スクリーンショット 2019-05-26 17 52 26" src="https://user-images.githubusercontent.com/11880332/58379608-b655f800-7fe0-11e9-9b6d-fb7a140b9f0f.png">


コピーしたプリセットの設定を編集します。

1. 名前をわかりやすい名前に変更してください。
2. ウォーターマークの設定は必要ないので削除します。

#### パイプラインの作成方法

<img width="976" alt="スクリーンショット 2019-05-26 18 11 34" src="https://user-images.githubusercontent.com/11880332/58379678-e225ad80-7fe1-11e9-8124-aa3dc15c1c32.png">

1. Pipeline Name：わかり易い名前をつけてください。
2. Input Bucket：01_create_s3_bucketで作成したバケットを指定してください。

【Configuration for Amazon S3 Bucket for Transcoded Files and Playlists】

1. Bucket：01_create_s3_bucketで作成したバケットを指定してください。
2. Storage Class：standerd

【Configuration for Amazon S3 Bucket for Thumbnails】

1. Bucket：01_create_s3_bucketで作成したバケットを指定してください。
2. Storage Class：standerd


```
cd 03_transcode2mp4
npm install
sls deploy --bucket your_bucket_name --preset_id=your_preset_id --pipeline_id=your_pipeline_id
sls s3deploy --bucket your_bucket_name --preset_id=your_preset_id --pipeline_id=your_pipeline_id

```

### 4.作成したmp4ファイルをPublishする

Iot Coreのカスタムエンドポイントを利用するのでメモしておく

Iot Core > 設定 で確認することができます。

```
cd 04_publish_mp4
npm install
sls deploy --bucket your_bucket_name --iot_endpoint your_iot_endpoint
sls s3deploy --bucket your_bucket_name --iot_endpoint your_iot_endpoint
```

### 5.Twitter APIを利用して、ツイートを取得する

Twitter APIを利用するため、あらかじめTwitter APIの利用申請が必要です。
利用申請が承認されましたら、下記の4つのキーが必要になりますので生成してください。

1. consumerKey
2. consumerSecret
3. accessToken
4. accessTokenSecret

```
cd 05_get_twitter
npm install
sls deploy --consumerKey your_twitter_consumerKey --consumerSecret your_twitter_consumerSecret --accessToken your_twitter_accessToken --accessTokenSecret your_twitter_accessTokenSecret
```
