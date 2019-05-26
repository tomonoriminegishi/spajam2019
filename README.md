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

### 2.複数のgifファイルを1つのAnimation gifファイルに変換

```
cd 02_create_animation_gif
npm run prebuild
npm run build
sls deploy --bucket your_bucket_name
sls s3deploy --bucket your_bucket_name
```

`
※ nodeのバージョンを10.xにするとうまくいかないため、node8.10を指定しています。
`

### 3.作成したAnimation gifファイルをmp4ファイルに変換

Animation gif形式だとtwitterに投稿できないようなので、さらに変換する。

Elastic Trancecoderを利用して、Animation gif → mp4へ変換する。

Elastic TrancecoderがCloudformationに対応していないようなので、
手作業で設定する必要があります。

`
※ 手作業は良くないなぁ。
`

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
