# spajam2019
spajam2019 東京予選A 週間#

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

Pipeline Name：わかり易い名前をつけてください。
Input Bucket：01_create_s3_bucketで作成したバケットを指定してください。

【Configuration for Amazon S3 Bucket for Transcoded Files and Playlists】

Bucket：01_create_s3_bucketで作成したバケットを指定してください。

Storage Class：standerd

【Configuration for Amazon S3 Bucket for Thumbnails】

Bucket：01_create_s3_bucketで作成したバケットを指定してください。

Storage Class：standerd


```
cd 03_transcode2mp4
sls deploy --bucket your_bucket_name --preset_id=your_preset_id --pipeline_id=your_pipeline_id
sls s3deploy --bucket your_bucket_name --preset_id=your_preset_id --pipeline_id=your_pipeline_id

```

### 4.作成したmp4ファイルをPublishする

Iot Coreのカスタムエンドポイントを利用するのでメモしておく

Iot Core > 設定 で確認することができます。

```
cd 04_publish_mp4
sls deploy --bucket your_bucket_name --iot_endpoint your_iot_endpoint
sls s3deploy --bucket your_bucket_name --iot_endpoint your_iot_endpoint
```
