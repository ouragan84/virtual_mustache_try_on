// Draw the points
export const drawMesh = (predictions, ctx) => {
    // let str = "NULL";

    if (predictions.length > 0){
        // str = "";
        predictions.forEach((predict) => {
            const keypoints = predict.landmarks;

            // draw points
            for(let i = 0; i < keypoints.length; i++){
                // str += "(" + keypoints[i][0] + ", " + keypoints[i][1] + ")   "
                const x = keypoints[i][0];
                const y = keypoints[i][1];
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, 3*Math.PI);
                ctx.fillStyle = "aqua";
                ctx.fill();
            }
            // str += "\n"
        });
    }

    // console.log(str);
}

export const drawMoustaches = (predict, ctx, mou, image) => {
    const scale = Math.sqrt(Math.pow(predict.landmarks[0][0]-predict.landmarks[1][0],2) + Math.pow(predict.landmarks[0][1]-predict.landmarks[1][1],2))/mou.span;
    const x = predict.landmarks[3][0] - mou.centerx*scale;
    const y = predict.landmarks[3][1] - mou.centery*scale;

    let theta = -(Math.atan((predict.landmarks[0][0]-predict.landmarks[1][0])/(predict.landmarks[0][1]-predict.landmarks[1][1])));
    if(theta < 0){
      theta += Math.PI;
    }
    theta -= Math.PI/2;

    drawImage(ctx, image, x, y, theta, scale);
} 

function drawImage(ctx, img, x, y, angle = 0, scale = 1){
    ctx.save();
    ctx.translate(x + img.width * scale / 2, y + img.height * scale / 2);
    ctx.rotate(angle);
    ctx.translate(- x - img.width * scale / 2, - y - img.height * scale / 2);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    ctx.restore();
  }

  