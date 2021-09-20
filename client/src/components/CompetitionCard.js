import React from 'react'

export const CompetitionCard = ({name, parts}) => {
    const {quantity, hyhienicalProgress, refereeProgress, completed} = parts

    return (
        <div className="card">
            <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center bg-secondary text-white">
                    {name}
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Участников
                    <span className="badge bg-secondary rounded-pill">{quantity}</span>
                </li>
                <li className="list-group-item">
                    Гигиенист
                    <div class="progress">
                        <div class="progress-bar bg-secondary" style={{width: `${hyhienicalProgress}%`}}>{hyhienicalProgress}%</div>
                    </div>
                </li>
                <li className="list-group-item">
                    Судьи
                    <div class="progress">
                        <div class="progress-bar bg-secondary" style={{width: `${refereeProgress}%`}}>{refereeProgress}%</div>
                    </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Завершили
                    <span className="badge bg-secondary rounded-pill">{completed}</span>
                </li>
            </ul>
        </div>
    )
}